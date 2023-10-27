import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, Image, ViewStyle } from 'react-native';
import { Text } from "./Text";
import { colors, spacing } from "../theme";

type SpeciesInfoModalProps = {
	userLatitude: string;
	userLongitude: string;
	location: string;
	species: {
		common_name: string;
		latin_name: string;
		taxon_name: string;
	};
};

const SpeciesInfoModal = ({userLatitude, userLongitude, location, species}: SpeciesInfoModalProps) => {
	const [speciesInformation, setSpeciesInformation] = useState('');
	const [speciesSightings, setSpeciesSightings] = useState([]);

	const collectSpeciesData = () => { 
		let encodedSpecies = encodeURIComponent(species.latin_name);

		fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageprops&exsentences=10&titles=${encodedSpecies}&format=json`)
		.then(response => response.json())
		.then((speciesInformation) => {
			let pageId = Object.keys(speciesInformation.query.pages)[0];
			let speciesExtract = speciesInformation.query.pages[`${pageId}`].extract
			let strippedExtract = speciesExtract.replace(/<[^>]+>/g, '');
			setSpeciesInformation(strippedExtract);
		})
		.then(() => {
			fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodedSpecies}&lat=${userLatitude}&lng=${userLongitude}&radius=30&order=desc&order_by=observed_on&identifications=most_agree&photos=true`)
			.then(response => response.json())
				.then((speciesSightings) => {
					let first6SpeciesSightings = speciesSightings.results.slice(0,6);
					setSpeciesSightings(first6SpeciesSightings);
				})
				.catch(error => console.log(error)
			)
		})
	}

	useEffect(() => {
		collectSpeciesData();
	}, []);

	return (
		<View>
			<View style={{ backgroundColor: colors.accent, padding: spacing.sm }}>
				{species.common_name &&
					<Text
						size="lg"
						text={species.common_name}
					/>
				}
				<Text
					size="md"
					text={species.latin_name}
					style={{ fontStyle: "italic", color: colors.secondary }}
				/>
				<Text
					size="sm"
					text={`of the ${species.taxon_name} kingdom`}
				/>
			</View>
			<ScrollView style={$speciesDesc}>
				{speciesInformation && speciesInformation.length > 10 ? 
					<Text
						size="sm"
						text={speciesInformation}
						style={{ padding: spacing.sm }}
					/>
					:
					<Text
						size="md"
						text="Unfortunately no information is available on this species right now 😿"
						style={{ padding: spacing.sm }}
					/>
				}
			</ScrollView>
			<Text
				size="lg"
				text={`6 recent sightings in ${location}`}
				style={{ backgroundColor: colors.accent, padding: spacing.sm }}
			/>
			<FlatList
				style={$flatList}
				numColumns={3}
				horizontal={false}
				data={speciesSightings}
				renderItem={({ item }) =>
					<View style={$sightingItem}>
						<Image
							style={{ height: 110, width: 110 }}
							source={{
								uri: item.photos[0].url
							}}
							accessibilityLabel={item.taxon.preferred_common_name}
						/>
						<Text>
							<Text
								text={`At ${item.place_guess} `}
								size="xxs"
								style={{ width: '100%' }}
							/>
							<Text
								text={`on ${item.created_at_details.date}`}
								size="xxs"
								style={{ width: '100%' }}
							/>
						</Text>
					</View>  
				}
				keyExtractor={(item) => item.id}
			/>
		</View>
	)
};

const $speciesDesc: ViewStyle = {
	maxHeight: '30%',
}

const $flatList: ViewStyle = {
	margin: spacing.sm,
	height: '40%',
}

const $sightingItem: ViewStyle = {
	flex: 1,
	width: 100,
	marginRight: spacing.xxs,
	marginLeft: spacing.xxs,
	flexBasis: '3%',
	paddingBottom: spacing.lg
}

export default SpeciesInfoModal;
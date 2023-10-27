import React, { FC, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  View,
  ViewStyle,
  TouchableOpacity
} from "react-native";
import { DrawerLayout, DrawerState } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Screen, Text } from "../components";
import { isRTL } from "../i18n";
import { colors, spacing } from "../theme";
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle";
import { DrawerIconButton } from "../components/DrawerIconButton";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { AppStackScreenProps } from "../navigators";
import SpeciesInfoModal from "app/components/SpeciesInfoModal";

interface SpeciesDirectoryScreenProps extends AppStackScreenProps<"SpeciesDirectory"> {
  Location: string
}

const logo = require("../../assets/images/thrive-icon.png");

export const SpeciesDirectoryScreen: FC<SpeciesDirectoryScreenProps> =
function SpeciesDirectoryScreen(_props) {
	const [open, setOpen] = useState(false);
	const drawerRef = useRef<DrawerLayout>();
	const progress = useSharedValue(0);
	const { navigation, route } = _props;
	const $drawerInsets = useSafeAreaInsetsStyle(["top"]);
	const [userLatitude, setUserLatitude] = useState('');
	const [userLongitude, setUserLongitude] = useState('');
	const [location, setLocation] = useState(route.params.Location);
	const [localSpecies, setLocalSpecies] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedSpecies, setSelectedSpecies] = useState({});

	const toggleDrawer = () => {
		if (!open) {
			setOpen(true)
			drawerRef.current?.openDrawer({ speed: 2 })
		} else {
			setOpen(false)
			drawerRef.current?.closeDrawer({ speed: 2 })
		}
	}

	useEffect(() => {
	sendLocation();
	}, [location])

	const sendLocation = () => {
		let encodedLocation = encodeURIComponent(location);
		fetch(`https://api.radar.io/v1/geocode/forward?query=${encodedLocation}`, {
			headers: new Headers({
			'Authorization': 'prj_test_pk_6c9bd026ac53aa56b33805981ffd0be33be3e7e3'
			})
		})
		.then(response => response.json())
		.then((coordinateResponse) => {
		setUserLatitude(coordinateResponse.addresses[0].latitude);
		setUserLongitude(coordinateResponse.addresses[0].longitude);
		fetch(`https://api.inaturalist.org/v1/observations/species_counts?photos=true&photo_licensed=true&identifications=most_agree&lat=${coordinateResponse.addresses[0].latitude}&lng=${coordinateResponse.addresses[0].longitude}&radius=1`)
			.then(response => response.json())
			.then((speciesInLocation) => {
			let first50Species = speciesInLocation.results.slice(0, 50);
			setLocalSpecies(first50Species);
			})
		})
		.catch(error => console.log(error))
	}

	return (
		<DrawerLayout
			ref={drawerRef}
			drawerWidth={Platform.select({ default: 326, web: Dimensions.get("window").width * 0.3 })}
			drawerType={"slide"}
			drawerPosition={isRTL ? "right" : "left"}
			overlayColor={open ? colors.palette.overlay20 : "transparent"}
			onDrawerSlide={(drawerProgress) => {
			progress.value = open ? 1 - drawerProgress : drawerProgress
			}}
			onDrawerStateChanged={(newState: DrawerState, drawerWillShow: boolean) => {
			if (newState === "Settling") {
				progress.value = withTiming(drawerWillShow ? 1 : 0, {
				duration: 250,
				})
				setOpen(drawerWillShow)
			}
			}}
			renderNavigationView={() => (
				<View style={[$drawer, $drawerInsets]}>
					<View style={{ display: 'flex', flexDirection: 'row', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
					<View style={$logoContainer}>
						<Image source={logo} style={$logoImage} />
					</View>
					<Text
						size="xxl"
						text="Thrive"
						style={{ fontStyle: "italic" }}
					/>
					</View>
					<Button
						text="Home"
						onPress={() => {
							navigation.navigate('Welcome')
							setLocation('');
						}}
					/>
					<Button
						text="About"
						onPress={() => {
							navigation.navigate('About')
						}}
					/>
				</View>
			)}
		>
		<Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
			<DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />

			<Header
				text="Thrive"
				image={logo}
			/>

			<Text
				size="lg"
				text="The enchanting creatures of..."
			/>
			<Text
				size="xxl"
				text={location}
				style={{ fontStyle: "italic", color: colors.secondary, marginBottom: spacing.sm }}
			/>

			<View>
				{localSpecies.length === 0 ? (
					<Text
						size="lg"
						text="Waiting for species..."
					/>
				) : (
					<FlatList
						style={{ marginBottom: '30%' }}
						data={localSpecies}
						numColumns={2}
						horizontal={false}
						renderItem={({ item }) =>
							<View style={{ width: '46%', margin: spacing.xs }}>
								<TouchableOpacity
									onPress={() => {
									setSelectedSpecies({
										common_name: item.taxon.preferred_common_name,
										latin_name: item.taxon.name,
										taxon_name: item.taxon.iconic_taxon_name
									})
									setModalVisible(true);
									}}
								>
									<Image
										style={{ height: 160, width: 'auto' }}
										source={{
											uri: item.taxon.default_photo.medium_url
										}}
										accessibilityLabel={item.taxon.preferred_common_name}
									/>
									{item.taxon.preferred_common_name &&
										<Text
											size="lg"
											text={item.taxon.preferred_common_name}
										/>
									}
									<Text
									size="md"
									text={item.taxon.name}
									style={{ fontStyle: "italic", color: colors.secondary }}
									/>
									<Text
									size="sm"
									text={`of the ${item.taxon.iconic_taxon_name} kingdom`}
									/>
								</TouchableOpacity>
							</View>
						}
						keyExtractor={(item) => item.taxon.id}
					/>
				)}
			</View>

			{modalVisible &&
				<View
					style={{
						position: 'absolute',
						top: '2%',
						left: '2%',
						bottom: '2%',
						right: '2%',
						backgroundColor: colors.background
					}}
				>
					<Button
						text="Back to results"
						onPress={() => {
							setModalVisible(false)
						}}
						style={{ borderRadius: 0 }}
					/>
					<SpeciesInfoModal userLatitude={userLatitude} userLongitude={userLongitude} location={location} species={selectedSpecies} />
				</View>
			}
		</Screen>
	</DrawerLayout>
	)
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
}

const $logoImage: ImageStyle = {
  height: 100,
  width: 100,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  paddingHorizontal: spacing.lg,
}

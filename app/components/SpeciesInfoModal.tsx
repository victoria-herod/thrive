import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SpeciesInfoModalProps = {
  userLatitude: string;
  userLongitude: string;
  species: {
    common_name: string;
    latin_name: string;
    taxon_name: string;
  };
};

const SpeciesInfoModal = ({userLatitude, userLongitude, species}: SpeciesInfoModalProps) => {
  const [speciesInformation, setSpeciesInformation] = useState('');
  const [speciesSightings, setSpeciesSightings] = useState([]);

  const collectSpeciesData = () => { 
    let encodedSpecies = encodeURIComponent(species.latin_name);
    console.log('encoded species', encodedSpecies);

    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageprops&exsentences=10&titles=${encodedSpecies}&format=json`)
    // .then(response => response.text())
    .then(response => response.json())
    .then((speciesInformation) => {
      let pageId = Object.keys(speciesInformation.query.pages)[0];
      let speciesExtract = speciesInformation.query.pages[`${pageId}`].extract
      let strippedExtract = speciesExtract.replace(/<[^>]+>/g, '');

      console.log('stripped extract', strippedExtract)

      setSpeciesInformation(strippedExtract);
    })
    .then(() => {
      fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodedSpecies}&lat=${userLatitude}&lng=${userLongitude}&radius=30&order=desc&order_by=observed_on&identifications=most_agree&photos=true`)
      .then(response => response.json())
        .then((speciesSightings) => {
          let first6SpeciesSightings = speciesSightings.results.slice(0,6);
          // console.log('first 6 species sightings', first6SpeciesSightings);
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
      <Text>{species.common_name}</Text>
      <Text>{species.latin_name}</Text>
      <Text>{species.taxon_name}</Text>
      <ScrollView style={styles.speciesDesc}>
        
          {speciesInformation ? <Text>{speciesInformation}</Text> : <Text>'No info on this species right now!'</Text>}
        
      </ScrollView>
        <Text>Last 5 sightings...</Text>
      <FlatList
        style={styles.flatList}
        numColumns={3}
        horizontal={false}
        data={speciesSightings}
        // contentContainerStyle={{justifyContent: 'center'}}
        renderItem={({ item }) =>
          <View style={styles.sightingItem}>
            <Image
              style={{ height: 100, width: 100 }}
              source={{
                uri: item.photos[0].url
              }}
              accessibilityLabel={item.taxon.preferred_common_name}
            />
            <Text style={{fontSize: 10}}>
              Seen at <Text style={{fontWeight: 'bold'}}>{`${item.place_guess}`}</Text> on the <Text style={{fontWeight: 'bold'}}>{`${item.created_at_details.date}`}</Text>
            </Text>
          </View>  
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  )
};

const styles = StyleSheet.create ({
  speciesDesc: {
    height: '40%',
    backgroundColor: 'seagreen'
  },
  flatList: {
    // flex: 1,
    // width: 'auto',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: '2%',
    // height: 500
  },
  sightingItem: {
    // flex: 1,
    width: 100,
    margin: 5
    // flexBasis: '3%'
  }
})

export default SpeciesInfoModal;
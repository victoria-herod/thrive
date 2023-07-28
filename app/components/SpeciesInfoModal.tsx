import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, FlatList, Image } from 'react-native';

type SpeciesInfoModalProps = {
  userLatitude: string;
  userLongitude: string;
  species: {};
};

const SpeciesInfoModal = ({userLatitude, userLongitude, species}: SpeciesInfoModalProps) => {

  const [speciesSightings, setSpeciesSightings] = useState([]);

  const collectSpeciesData = () => {

    console.log('hello in collect species data')
  
    console.log('props just about to console log!!!')
    console.log('props initial console log', userLatitude);
    console.log('props initial console log', userLongitude);
    console.log('props initial console log', species);
  
    let encodedSpecies = encodeURIComponent(species.common_name);
  

    fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodedSpecies}&lat=${userLatitude}&lng=${userLongitude}&radius=30&order=desc&order_by=observed_on&identifications=most_agree&photos=true`)
    .then(response => response.json())
      .then((speciesSightings) => {
  
  
        console.log('response from observation sightings data', speciesSightings)
        // setUserLatitude(coordinateResponse.addresses[0].latitude);
        // setUserLongitude(coordinateResponse.addresses[0].longitude);
        // fetch(`https://api.inaturalist.org/v1/observations/species_counts?photos=true&photo_licensed=true&identifications=most_agree&lat=${userLatitude}&lng=${userLongitude}&radius=1`)
        // .then(response => response.json())
        // .then((speciesInLocation) => {
          let first5SpeciesSightings = speciesSightings.results.slice(0,5);
          setSpeciesSightings(first5SpeciesSightings);
  
          console.log('first 50 species sightings', first5SpeciesSightings);
        //   setLocalSpecies(first50Species);
        //   console.log('first 50 species', first50Species);
        // })
      })
      .catch(error => console.log(error))
    }
  // }

  useEffect(() => {
    collectSpeciesData();
  }, []);

  

    return (
    <View>
      <Text>{species.common_name}</Text>
      <Text>{species.latin_name}</Text>
      <Text>{species.taxon_name}</Text>
        <Text>Last 5 sightings...</Text>
          <FlatList
            data={speciesSightings}
            renderItem={({ item }) =>
              <View>
                <Image
                  style={{ height: 100, width: 100 }}
                  source={{
                    uri: item.photos[0].url
                  }}
                  accessibilityLabel={item.taxon.preferred_common_name}
                />
                <Text>
                  Seen at <Text style={{fontWeight: 'bold'}}>{`${item.place_guess}`}</Text> on the <Text style={{fontWeight: 'bold'}}>{`${item.created_at_details.date}`}</Text>
                </Text>
            </View>  
          }
          keyExtractor={(item) => item.id}
        />
    </View>
  )
};

export default SpeciesInfoModal;
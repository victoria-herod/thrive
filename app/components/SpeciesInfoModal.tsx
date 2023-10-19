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

    console.log('hello in collect species data', species);
  
    let encodedSpecies = encodeURIComponent(species.latin_name);
    console.log('encoded species', encodedSpecies);
  
  //   fetch(`https://api.wikimedia.org/core/v1/wikipedia/en/page/${encodedSpecies}/html`, {
  //     headers: {
  //       'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJkNWM3ZTFiMjc4Y2QzMDBhYzZhOTYwYjg1M2E1YmM1NiIsImp0aSI6IjRmMDhiNGMxMDJkODcyOTQ1OWM1MTQ1MzUyMWYzN2E1MjQ1NzYzM2FlNjNjNjU5ZTQyMGE1OTQyZTkyMWQwMGEzYzA5YjcwNGUzY2FlZmYzIiwiaWF0IjoxNjkwNTU4MjkxLjQzNDA2NCwibmJmIjoxNjkwNTU4MjkxLjQzNDA2NywiZXhwIjozMzI0NzQ2NzA5MS40MzI1MDcsInN1YiI6IjczNDAxMjI0IiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyJdfQ.sklQOUgQN0XmHPjwAy6DLA-etM1sMO_N64KOP1hFhHrd3_KgmslVQRvI3tmb23Tlpih274VqyQt-vSFBAcZSE2rr3eqb01larXHqHdRfC-RlxSAXIISU1DfkF_LfTH8DPSQ3NeB-BfjC66HXsRDvXcQVcUqOqyx-KVGqP8I4btcLBzi6dC5oGPj0T-_Lr4BKOH7GqDNkx_pm9MAjOlZ_If_G2a3KewajBfI3SASql9CCzn4lC0zA0EE4PUpktIAWZU50Rb7lP9msR30fvhEUyrlmkuIXhyTKlu7nWUmzcSA2rkovT0anN-WP1D6VV-kz4rHgHrA4w0V7gQDqzXTonj5Q8AOomRoZlEquWvrZVCRyo91CQvswaFIjGSY0aDRTaG-Ib612vkQmD1GdNIksspIGyAduEZ1R4_CuTs5ljy3t7Z_1ErYTbq0J6s3d0Lj_a9IGPSUNImjcqc_0wfjWToLBX69hEIrNuZJf2iNItQNH9J1I1r0fbFYxCnb4P9QwYrgpZrc4Bccv3HvK-NVe_my4_u0X4XcYaIrGi0YHiWMAp8HUiSvFgiuJnUxehed8IDVGMRyqSNWLXoXryUXyMiSqb2-0qX2z0GGHYmC1b0hdZIuAKmyREH6FSp_YbWr3FbSf4tkCC59YWex7MB91Miso6WGkFxThxjVjicBkm6A',
  //       'Api-User-Agent': 'Thrive'
  //     }
  // })
  fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageprops&exsentences=40&titles=${encodedSpecies}&format=json`)
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
          setSpeciesSightings(first6SpeciesSightings);
      })
      .catch(error => console.log(error))
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
        <Text>Last 5 sightings...</Text>
      <FlatList
        style={styles.flatList}
        numColumns={3}
        horizontal={false}
        data={speciesSightings}
        renderItem={({ item }) =>
          <View style={styles.sightingItem}>
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
      <ScrollView style={{height: 400}}>

          {/* <View>
          
          </View> */}
          
        <Text>
          {speciesInformation}
        </Text>
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create ({
  flatList: {
    // flex: 1,
    // width: 'auto',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: '3%',
    // height: 500
  },
  sightingItem: {
    // flex: 1,
    width: '10%'
    // flexBasis: '3%'
  }
})

export default SpeciesInfoModal;
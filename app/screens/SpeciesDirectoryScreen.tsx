import { Link, RouteProp, useRoute } from "@react-navigation/native"
import React, { FC, ReactElement, useEffect, useRef, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  SectionList,
  TextStyle,
  View,
  ViewStyle,
  Button,
  TouchableOpacity,
  ListRenderItem
} from "react-native"
import { DrawerLayout, DrawerState, TextInput } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { ListItem, Screen, Text, TextField } from "../components"
import { isRTL } from "../i18n"
import { DemoTabParamList, DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import * as Demos from "./DemoShowroomScreen/demos"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"

import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import ja from "date-fns/locale/ja/index"

import SpeciesInfoModal from "app/components/SpeciesInfoModal";

interface SpeciesDirectoryScreenProps extends AppStackScreenProps<"SpeciesDirectory"> {
  Location: string
}

const logo = require("../../assets/images/logo.png")

export const SpeciesDirectoryScreen: FC<SpeciesDirectoryScreenProps> =
  function SpeciesDirectoryScreen(_props) {
    const [open, setOpen] = useState(false)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const drawerRef = useRef<DrawerLayout>()
    const listRef = useRef<SectionList>()
    const progress = useSharedValue(0);
    const { navigation, route } = _props;

    const $drawerInsets = useSafeAreaInsetsStyle(["top"])

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
      // return () => timeout.current && clearTimeout(timeout.current)
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
        // })
        .then(response => response.json())
          .then((speciesInLocation) => {
            let first50Species = speciesInLocation.results.slice(0,50);
            setLocalSpecies(first50Species);
            console.log('first 50 species', first50Species);
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
            <View style={$logoContainer}>
              <Image source={logo} style={$logoImage} />
            </View>
            <Button
            title="Restart"
            onPress={() => navigation.navigate('Welcome')}
            // onPress={sendLocation}
            disabled={location.length === 0}
          />
          </View>
        )}
      >
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
          <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />
          <Text
            onPress={() => {
              navigation.navigate('Welcome');
              setLocation('');
            }}
          >
            Home!
          </Text>
          <Text>Wildlife App SpeciesDirectory Screen</Text>
          <Text>Species in {location}, {userLatitude} {userLongitude}</Text>
          <Text>~~~</Text>

          <View>
          {localSpecies.length === 0 ? (
            <Text>Waiting for species...</Text>
          ) : (
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
              <FlatList
                data={localSpecies}
                numColumns={2}
                horizontal={false}
                renderItem={({ item }) =>
                  <View style={{width: '50%', margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSpecies({common_name: item.taxon.preferred_common_name, latin_name: item.taxon.name, taxon_name: item.taxon.iconic_taxon_name})
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
                      <Text>{`${item.taxon.preferred_common_name ? item.taxon.preferred_common_name : '(no common name provided)'} / ${item.taxon.name} of the ${item.taxon.iconic_taxon_name} kingdom`}</Text>
                    </TouchableOpacity>
                  </View>  
                }
                keyExtractor={(item) => item.taxon.id}
              />
            </View>
          )}
          </View>
          {modalVisible && 
            <View
              style= {{
                position: 'absolute',
                top: '2%',
                left: '2%',
                bottom: '2%',
                right: '2%',
                height: '95%',
                width: '95%',
                // flex: 1,
                // margin: 50,
                backgroundColor: 'white'
              }}
            >
              <Text
                onPress={() => setModalVisible(false)}
              >
                X
              </Text>
              <SpeciesInfoModal userLatitude={userLatitude} userLongitude={userLongitude} species={selectedSpecies} />
            </View>
          }
        </Screen>



              {/* <FlatList<{commonName: string, name: string, kingdom: string}>
                data={localSpecies.map(ja) => {
                  commonName: localSpeciesItem.commonName,
                  name: localSpeciesItem.name,
                  kingdom: localSpeciesItem.kingdom,
                }}
                renderItem={(localSpeciesItem) => {
                  <Text>{localSpeciesItem.commonName}</Text>
                }}
              /> */}

            {/* <FlatList<{ name: string; useCases: string[] }>
              ref={menuRef}
              contentContainerStyle={$flatListContentContainer}
              data={Object.values(Demos).map((d) => ({
                name: d.name,
                useCases: d.data.map((u) => u.props.name),
              }))}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index: sectionIndex }) => (
                <ShowroomListItem {...{ item, sectionIndex, handleScroll }} />
              )}
            /> */}

            
          

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

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
}

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  paddingHorizontal: spacing.lg,
}

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
}

const $demoItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
}

const $demoItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
}

const $demoUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
}
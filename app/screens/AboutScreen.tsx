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
  TouchableOpacity,
  ListRenderItem,
  Linking
} from "react-native"
import { DrawerLayout, DrawerState, TextInput } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { ListItem, Screen, Text, TextField } from "../components"
import { isRTL } from "../i18n"
import { DemoTabParamList, DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { DrawerIconButton } from "../components/DrawerIconButton"
import { Header } from '../components/Header';
import { Button } from '../components/Button';

import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import ja from "date-fns/locale/ja/index"

interface AboutScreenProps extends AppStackScreenProps<"About"> {}

const logo = require("../../assets/images/thrive-icon.png")

export const AboutScreen: FC<AboutScreenProps> =
  function AboutScreen(_props) {
    const [open, setOpen] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const drawerRef = useRef<DrawerLayout>();
    const listRef = useRef<SectionList>();
    const progress = useSharedValue(0);
    const { navigation } = _props;

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
      return () => timeout.current && clearTimeout(timeout.current)
    }, [])

    const $drawerInsets = useSafeAreaInsetsStyle(["top"])

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
                style={{fontStyle: "italic"}}
              />
            </View>
            <Button
              text="Home"
              onPress={() => {
                navigation.navigate('Welcome')
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

          <Text style={{ margin: spacing.sm }}>
            Thrive is an informational app for nature enthusiasts or those that want to achieve that status. By entering a post code, town, country, or any other kind of geographical reference, you can discover the fauna, flora and fungi that inhabit that area and access the latest sightings. Whether entering a current address or a place 2,000 miles away seen only in a Lonely Planet guide, Thrive provides a window into the array of life in any part of the world.
          </Text>
          <Text style={{ margin: spacing.sm }}>
            My name is Victoria, and I created this app as part of my self-led training at <Text style={{fontWeight: "900"}} onPress={() => Linking.openURL('https://www.happyporch.com/')}>HappyPorch</Text> to help 'unlock' knowledge of wildlife, and to spark appreciation for our unbelievably cool planet. My hope is that an enhanced sense of the magic surrounding us can create a stepping stone into more sustainable and circular ways of living.
          </Text>
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
  height: 100,
  width: 100,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  paddingHorizontal: spacing.lg,
}
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

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

const logo = require("../../assets/images/logo.png")

export const WelcomeScreen: FC<WelcomeScreenProps> =
  function WelcomeScreen(_props) {
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

    const [location, setLocation] = useState('');

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
          </View>
        )}
      >
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
          <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />
          <Text>Wildlife App Welcome Screen</Text>
          <Text>~~~</Text>
          {/* <Text>https://api.nbnatlas.org/#ws78 API - species occurrence in radius of coordinates</Text> */}

          <TextField onChangeText={textLocation => {setLocation(textLocation)}}/>
          <Button
            title="Go!"
            onPress={() => navigation.navigate('SpeciesDirectory', {
              Location: location,
            })}
            // onPress={sendLocation}
            disabled={location.length === 0}
          />
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

// @demo remove-file






// import { observer } from "mobx-react-lite"
// import React, { FC } from "react"
// import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
// import {
//   Button, // @demo remove-current-line
//   Text,
// } from "../components"
// import { isRTL } from "../i18n"
// import { useStores } from "../models" // @demo remove-current-line
// import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
// import { colors, spacing } from "../theme"
// import { useHeader } from "../utils/useHeader" // @demo remove-current-line
// import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

// const welcomeLogo = require("../../assets/images/logo.png")
// const welcomeFace = require("../../assets/images/welcome-face.png")

// interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

// export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
//   _props, // @demo remove-current-line
// ) {
//   // @demo remove-block-start
//   const { navigation } = _props
//   const {
//     authenticationStore: { logout },
//   } = useStores()

//   function goNext() {
//     navigation.navigate("Demo", { screen: "DemoShowroom" })
//   }

//   useHeader(
//     {
//       rightTx: "common.logOut",
//       onRightPress: logout,
//     },
//     [logout],
//   )
//   // @demo remove-block-end

//   const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

//   return (
//     <View style={$container}>
//       <View style={$topContainer}>
//         <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
//         <Text
//           testID="welcome-heading"
//           style={$welcomeHeading}
//           tx="welcomeScreen.readyForLaunch"
//           preset="heading"
//         />
//         <Text tx="welcomeScreen.exciting" preset="subheading" />
//         <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
//       </View>

//       <View style={[$bottomContainer, $bottomContainerInsets]}>
//         <Text tx="welcomeScreen.postscript" size="md" />
//         {/* @demo remove-block-start */}
//         <Button
//           testID="next-screen-button"
//           preset="reversed"
//           tx="welcomeScreen.letsGo"
//           onPress={goNext}
//         />
//         {/* @demo remove-block-end */}
//       </View>
//     </View>
//   )
// })

// const $container: ViewStyle = {
//   flex: 1,
//   backgroundColor: colors.background,
// }

// const $topContainer: ViewStyle = {
//   flexShrink: 1,
//   flexGrow: 1,
//   flexBasis: "57%",
//   justifyContent: "center",
//   paddingHorizontal: spacing.lg,
// }

// const $bottomContainer: ViewStyle = {
//   flexShrink: 1,
//   flexGrow: 0,
//   flexBasis: "43%",
//   backgroundColor: colors.palette.neutral100,
//   borderTopLeftRadius: 16,
//   borderTopRightRadius: 16,
//   paddingHorizontal: spacing.lg,
//   justifyContent: "space-around",
// }
// const $welcomeLogo: ImageStyle = {
//   height: 88,
//   width: "100%",
//   marginBottom: spacing.xxl,
// }

// const $welcomeFace: ImageStyle = {
//   height: 169,
//   width: 269,
//   position: "absolute",
//   bottom: -47,
//   right: -80,
//   transform: [{ scaleX: isRTL ? -1 : 1 }],
// }

// const $welcomeHeading: TextStyle = {
//   marginBottom: spacing.md,
// }

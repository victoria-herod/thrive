import React, { ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  Image,
  ImageStyle,
} from "react-native"
import { isRTL, translate } from "../i18n"
import { colors, spacing } from "../theme"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { Icon, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"

export interface HeaderProps {
    text: string;
    image: string;
}

export function Header(props: HeaderProps) {
    const {
        text,
        image
    } = props;

    return (
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: spacing.xxxl, marginBottom: spacing.xxxl }}>
            <View style={$logoContainer}>
                <Image source={image} style={$logoImageIntro} />
            </View>
            <Text
                size="xxxxl" 
                text={text}
                style={{ fontStyle: "italic" }}
            />
        </View>
    )
}

const $logoContainer: ViewStyle = {
    alignSelf: "flex-start",
    justifyContent: "center",
    height: 56,
    paddingHorizontal: spacing.lg,
}

const $logoImageIntro: ImageStyle = {
    height: 150,
    width: 150,
  }
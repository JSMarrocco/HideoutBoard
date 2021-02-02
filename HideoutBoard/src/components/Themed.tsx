import * as React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import { TextInput as DefaultTextInput,  Button as DefaultButton, Appbar as DefaultAppbar } from "react-native-paper";
import { TextInputProps as DefaultTextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";

import Colors, { orangeColor } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInputProps
export type ButtonProps = ThemeProps & DefaultButton["props"];
export type AppbarProps = ThemeProps & DefaultAppbar["props"];

export function Text(props: TextProps): JSX.Element {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps): JSX.Element {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}


export const TextInput = (props: TextInputProps): JSX.Element => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, "primary");

    return (
        <DefaultTextInput
            style={[{ backgroundColor }, style]}
            theme={{ colors: { primary: themeColor  } }}
            {...otherProps} />
    );
};

export const Button = (props: ButtonProps): JSX.Element => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, "primary");
    const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, "buttonText");
    return (
        <DefaultButton
            style={style}
            {...otherProps}
            labelStyle={{color: labelColor}}
            theme={{ colors: { primary: themeColor, backgroundColor: themeColor,   } }}
        />
    );
};

export const AppbarHeader = (props: AppbarProps): JSX.Element => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, "primary");
    return (
        <DefaultAppbar.Header
            style={[{ backgroundColor }, style]}
            {...otherProps}
            theme={{ colors: { primary: themeColor, backgroundColor: themeColor,   } }}
        />
    );
};

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import api from "../core/api"
import utils from "../core/utils"
import useGlobal from "../core/globalStore"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  interpolateColor,
} from "react-native-reanimated"

// Theme constants
const COLORS = {
  primary: "#4F46E5",
  background: "#F8F9FB",
  light: "#FFFFFF",
  dark: "#202020",
  gray: "#606060",
}

const FONTS = {
  h1: { fontSize: 28, fontWeight: "700" },
  h2: { fontSize: 24, fontWeight: "700" },
  h3: { fontSize: 18, fontWeight: "600" },
  body3: { fontSize: 14, fontWeight: "500" },
  body4: { fontSize: 12, fontWeight: "400" },
}

const SIZES = {
  padding: 16,
  base: 8,
  radius: 12,
}

const SignUpScreen = () => {
  const navigation = useNavigation()
  const login = useGlobal((state) => state.login)

  const [name, setName] = useState("")
  const [nameFocused, setNameFocused] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [email, setEmail] = useState("")
  const [emailFocused, setEmailFocused] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mount = useSharedValue(0)
  const nameFocusSV = useSharedValue(0)
  const usernameFocusSV = useSharedValue(0)
  const emailFocusSV = useSharedValue(0)
  const passwordFocusSV = useSharedValue(0)
  const confirmPasswordFocusSV = useSharedValue(0)
  const btnScale = useSharedValue(1)

  useEffect(() => {
    mount.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
  }, [])

  useEffect(() => {
    nameFocusSV.value = withTiming(nameFocused ? 1 : 0, { duration: 180 })
  }, [nameFocused])

  useEffect(() => {
    usernameFocusSV.value = withTiming(usernameFocused ? 1 : 0, { duration: 180 })
  }, [usernameFocused])

  useEffect(() => {
    emailFocusSV.value = withTiming(emailFocused ? 1 : 0, { duration: 180 })
  }, [emailFocused])

  useEffect(() => {
    passwordFocusSV.value = withTiming(passwordFocused ? 1 : 0, { duration: 180 })
  }, [passwordFocused])

  useEffect(() => {
    confirmPasswordFocusSV.value = withTiming(confirmPasswordFocused ? 1 : 0, { duration: 180 })
  }, [confirmPasswordFocused])

  const brandStyle = useAnimatedStyle(() => ({
    opacity: mount.value,
    transform: [{ translateY: interpolate(mount.value, [0, 1], [12, 0]) }],
  }))

  const brandUnderline = useAnimatedStyle(() => ({
    width: `${mount.value * 100}%`,
    opacity: mount.value,
  }))

  const cardStyle = useAnimatedStyle(() => ({
    opacity: mount.value,
    transform: [{ translateY: interpolate(mount.value, [0, 1], [18, 0]) }],
  }))

  const nameInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(nameFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const usernameInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(usernameFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const emailInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(emailFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const passwordInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(passwordFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const confirmPasswordInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(confirmPasswordFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const btnAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }))

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.")
      return
    }

    setIsLoading(true)
    try {
      const [firstName, ...lastNameParts] = name.trim().split(' ')
      const lastName = lastNameParts.join(' ')
      
      const response = await api.post("signup/", {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        password: password.trim(),
      })

      utils.log("✅ Sign Up Successful:", response.data)
      const { user, tokens } = response.data
      login({ username: username.trim().toLowerCase(), password: password.trim() }, user, tokens)
      navigation.navigate("Home")
    } catch (error) {
      Alert.alert("Registration Failed", error.response?.data?.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <Animated.View accessible accessibilityRole="header" style={[styles.brandHeader, brandStyle]}>
            <Text style={styles.brand}>Realtime Chat</Text>
            <Animated.View style={[styles.brandUnderline, brandUnderline]} />
            <Text style={styles.tagline}>Connect and Chat in Real-Time</Text>
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]} accessibilityLabel="Sign up form">
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community today</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full name</Text>
              <Animated.View style={nameInputAnimated}>
                <TextInput
                  style={[styles.input, nameFocused && styles.inputFocused]}
                  placeholder="Jane Doe"
                  placeholderTextColor={COLORS.gray}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  accessibilityLabel="Full name"
                  returnKeyType="next"
                />
              </Animated.View>

              <Text style={styles.inputLabel}>Username</Text>
              <Animated.View style={usernameInputAnimated}>
                <TextInput
                  style={[styles.input, usernameFocused && styles.inputFocused]}
                  placeholder="johndoe"
                  placeholderTextColor={COLORS.gray}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  accessibilityLabel="Username"
                  returnKeyType="next"
                />
              </Animated.View>

              <Text style={styles.inputLabel}>Email address</Text>
              <Animated.View style={emailInputAnimated}>
                <TextInput
                  style={[styles.input, emailFocused && styles.inputFocused]}
                  placeholder="john@example.com"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  accessibilityLabel="Email address"
                  returnKeyType="next"
                />
              </Animated.View>

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Animated.View style={passwordInputAnimated}>
                  <TextInput
                    style={[styles.input, styles.inputWithRightPadding, passwordFocused && styles.inputFocused]}
                    placeholder="Create a strong password"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    accessibilityLabel="Password"
                    returnKeyType="next"
                  />
                </Animated.View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.inputToggle}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Animated.View style={confirmPasswordInputAnimated}>
                  <TextInput
                    style={[styles.input, styles.inputWithRightPadding, confirmPasswordFocused && styles.inputFocused]}
                    placeholder="Re-enter your password"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    accessibilityLabel="Confirm password"
                    returnKeyType="done"
                  />
                </Animated.View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  style={styles.inputToggle}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.toggleText}>{showConfirmPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View style={btnAnimated}>
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
                onPressIn={() => (btnScale.value = withTiming(0.98, { duration: 90 }))}
                onPressOut={() => (btnScale.value = withTiming(1, { duration: 90 }))}
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading }}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.light} />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text style={[styles.footerText, styles.linkText]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SIZES.padding,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: SIZES.padding * 1.5,
  },
  brand: {
    ...FONTS.h2,
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  brandUnderline: {
    marginTop: 6,
    height: 2,
    alignSelf: "stretch",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tagline: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: SIZES.base * 0.75,
  },
  card: {
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.dark,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
  },
  inputContainer: {
    marginBottom: SIZES.padding,
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base * 0.5,
    marginLeft: SIZES.base * 0.5,
  },
  input: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    borderRadius: SIZES.radius,
    ...FONTS.body3,
    color: COLORS.dark,
    marginBottom: SIZES.padding * 0.75,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: SIZES.padding * 0.75,
  },
  inputWithRightPadding: {
    paddingRight: SIZES.padding * 3,
  },
  inputToggle: {
    position: "absolute",
    right: SIZES.padding * 0.5,
    top: SIZES.padding * 0.5,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base * 0.5,
    borderRadius: SIZES.radius * 0.5,
  },
  toggleText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: "600",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding * 0.85,
    borderRadius: SIZES.radius,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZES.base,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.light,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
})

export default SignUpScreen

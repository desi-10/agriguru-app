import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import axios from "axios"; // Add this import
import { useRouter, useLocalSearchParams } from "expo-router";

const OtpInputScreen: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  console.log("Params:", params);

  const handleChangeText = (value: string, index: number): void => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (value: string, index: number): void => {
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    try {
      await verifyOtp(otpValue);
      router.push("/sign-in");
    } catch (error) {
      alert("OTP verification failed. Please try again.");
    }
  };

  const verifyOtp = async (otpValue: string): Promise<void> => {
    try {
      const { data } = await axios.post(
        "https://agriguru.pythonanywhere.com/api/auth/verify-otp/",
        { otp: otpValue, phone_number: params.phone_number }
      );
    } catch (error) {
      throw new Error("OTP verification failed");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter 6-Digit OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your phone</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChangeText(value, index)}
            onKeyPress={(
              e: NativeSyntheticEvent<TextInputKeyPressEventData>
            ) => {
              if (e.nativeEvent.key === "Backspace") {
                handleBackspace(digit, index);
              }
            }}
            keyboardType="numeric"
            maxLength={1}
            ref={(input) => (inputRefs.current[index] = input)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/sign-in")}>
        <Text style={{ color: "#4CAF50", marginTop: 20 }}>
          Back to Sign In page
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  otpInput: {
    backgroundColor: "#F4F4F4",
    borderColor: "#4CAF50",
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    margin: 5,
    width: 45,
    height: 50,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default OtpInputScreen;

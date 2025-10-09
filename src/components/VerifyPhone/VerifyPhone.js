import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpModal = ({ 
  visible, 
  onClose, 
  onVerified, 
  showToast 
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtpInput, setShowOtpInput] = useState(false); // Track if OTP section is shown

  // OTP Timer Effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setOtpMessage("Enter a valid 10-digit phone number");
      return;
    }

    setOtpLoading(true);
    const generatedOtp = generateOTP();
    setOtp(generatedOtp);

    try {
      const smsApiUrl = "https://sms.textspeed.in/vb/apikey.php";
      const params = new URLSearchParams({
        apikey: "2J8jg3HoFzNpJKhR",
        senderid: "BMGJEW",
        templateid: "1707174840853673783",
        number: `91${phoneNumber}`,
        message: `Welcome ${"user"}! Do not share your OTP below with anyone to verify your phone number. This code is valid for 5 minutes. BMG JEWELLERS PRIVATE LIMITED\n\nYour OTP is ${generatedOtp}`,
      });

      const response = await fetch(`${smsApiUrl}?${params}`);
      const result = await response.json();

      if (response.ok && result.status === "Success") {
        setOtpMessage("OTP sent successfully");
        setResendTimer(30); // 5 minutes as per the template
        setShowOtpInput(true); // Show OTP input after successful send
      } else {
        setOtpMessage(result.description || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setOtpMessage("Network error, try again");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (enteredOtp.length !== 6) {
      setOtpMessage("Enter a valid 6-digit OTP");
      return;
    }

    if (enteredOtp === otp) {
      // Save verified number
      await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
      setOtpMessage("");
      onVerified(); // Trigger parent's data refresh
      onClose();
      showToast("Phone number verified successfully");
    } else {
      setOtpMessage("Invalid OTP");
    }
  };

  const resetModal = () => {
    setPhoneNumber("");
    setOtp("");
    setEnteredOtp("");
    setOtpMessage("");
    setResendTimer(0);
    setShowOtpInput(false);
    setOtpLoading(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={otpStyles.modalBackground}>
        <View style={otpStyles.modalContainer}>
          <Text style={otpStyles.title}>
            {showOtpInput ? "Enter OTP" : "Enter your mobile number"}
          </Text>
          
          {!showOtpInput ? (
            <>
              <TextInput
                style={otpStyles.input}
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              {otpMessage !== "" && (
                <Text style={otpStyles.error}>{otpMessage}</Text>
              )}
              <TouchableOpacity style={otpStyles.button} onPress={sendOtp}>
                {otpLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={otpStyles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={otpStyles.infoText}>
                OTP sent to +91{phoneNumber}
              </Text>
              <TextInput
                style={otpStyles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                maxLength={6}
                value={enteredOtp}
                onChangeText={setEnteredOtp}
              />
              {otpMessage !== "" && (
                <Text style={otpStyles.error}>{otpMessage}</Text>
              )}
              <TouchableOpacity style={otpStyles.button} onPress={verifyOtp}>
                <Text style={otpStyles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={otpStyles.button} onPress={resetModal}>
                <Text style={otpStyles.buttonTextSecondary}>Change Number</Text>
              </TouchableOpacity>
              {resendTimer > 0 ? (
                <Text style={otpStyles.timerText}>Resend OTP in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={sendOtp}>
                  <Text style={otpStyles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ------------------- OTP MODAL STYLES -------------------
const otpStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  button: { 
    backgroundColor: "#007bff", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 10 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  buttonTextSecondary: {
    color: "#007bff",
    fontWeight: "bold",
  },
  error: { 
    color: "red", 
    marginBottom: 10,
    textAlign: "center",
  },
  resendText: { 
    color: "#007bff", 
    marginTop: 10,
    textAlign: "center",
  },
  timerText: {
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
});

export default OtpModal;
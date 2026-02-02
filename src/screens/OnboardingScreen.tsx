import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../api/supabase';
import { 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  Lock, 
  Users, 
  Activity, 
  XCircle,
  CheckCircle2
} from 'lucide-react-native';

const OnboardingScreen = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Step 2: Household & Health
  const [householdSize, setHouseholdSize] = useState('1');
  const [conditions, setConditions] = useState<string[]>([]);

  // Step 3: Dislikes
  const [dislikedFood, setDislikedFood] = useState('');
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);

  const validatePassword = (pass: string) => {
    const hasMinLength = pass.length >= 12;
    const hasAlphanumeric = /[a-zA-Z]/.test(pass) && /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    if (!hasMinLength) return "Password must be at least 12 characters.";
    if (!hasAlphanumeric) return "Password must contain both letters and numbers.";
    if (!hasSymbol) return "Password must contain at least one symbol.";
    return "";
  };

  const handleNext = () => {
    if (step === 1) {
      const error = validatePassword(password);
      if (error) {
        setPasswordError(error);
        return;
      }
      setPasswordError('');
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const toggleCondition = (condition: string) => {
    setConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  const addDislikedFood = () => {
    if (dislikedFood.trim() && !dislikedFoods.includes(dislikedFood.trim())) {
      setDislikedFoods([...dislikedFoods, dislikedFood.trim()]);
      setDislikedFood('');
    }
  };

  const removeDislikedFood = (food: string) => {
    setDislikedFoods(dislikedFoods.filter(f => f !== food));
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            household_size: parseInt(householdSize),
            medical_conditions: conditions,
            disliked_foods: dislikedFoods,
          }
        }
      });

      if (error) throw error;
      
      Alert.alert(
        "Success!", 
        "Please check your email for a verification link.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View className="space-y-6">
      <View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome</Text>
        <Text className="text-gray-500 text-lg">Let's start with your account details.</Text>
      </View>

      <View className="space-y-4">
        <View className="relative">
          <View className="absolute left-3 top-3 z-10">
            <Mail size={20} color="#6B7280" />
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="relative">
          <View className="absolute left-3 top-3 z-10">
            <Lock size={20} color="#6B7280" />
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {passwordError ? (
          <Text className="text-red-500 text-sm ml-1">{passwordError}</Text>
        ) : (
          <Text className="text-gray-400 text-xs ml-1">
            Min 12 chars, alphanumeric, and 1 symbol.
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="space-y-6">
      <View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">About You</Text>
        <Text className="text-gray-500 text-lg">Help us tailor recipes for your health.</Text>
      </View>

      <View className="space-y-4">
        <Text className="text-sm font-semibold text-gray-700">Household Size</Text>
        <View className="relative">
          <View className="absolute left-3 top-3 z-10">
            <Users size={20} color="#6B7280" />
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900"
            placeholder="Number of people"
            value={householdSize}
            onChangeText={setHouseholdSize}
            keyboardType="numeric"
          />
        </View>

        <Text className="text-sm font-semibold text-gray-700 mt-4">Medical Conditions</Text>
        <View className="flex-row flex-wrap gap-2">
          {['Cancer', 'Heart Disease', 'Diabetes'].map((condition) => (
            <TouchableOpacity
              key={condition}
              onPress={() => toggleCondition(condition)}
              className={`flex-row items-center px-4 py-2 rounded-full border ${
                conditions.includes(condition)
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Activity 
                size={16} 
                color={conditions.includes(condition) ? 'white' : '#6B7280'} 
                className="mr-2"
              />
              <Text className={conditions.includes(condition) ? 'text-white font-medium' : 'text-gray-600'}>
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-xs text-gray-400 italic mt-2">
          * Recipes are cross-referenced with medical research.
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="space-y-6">
      <View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">Preferences</Text>
        <Text className="text-gray-500 text-lg">Any foods you'd like to avoid?</Text>
      </View>

      <View className="space-y-4">
        <View className="flex-row space-x-2">
          <TextInput
            className="flex-1 bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900"
            placeholder="e.g., Mushrooms, Cilantro"
            value={dislikedFood}
            onChangeText={setDislikedFood}
            onSubmitEditing={addDislikedFood}
          />
          <TouchableOpacity 
            onPress={addDislikedFood}
            className="bg-primary px-6 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-bold">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {dislikedFoods.map((food) => (
            <View 
              key={food}
              className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
            >
              <Text className="text-gray-700 mr-2">{food}</Text>
              <TouchableOpacity onPress={() => removeDislikedFood(food)}>
                <XCircle size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 pt-16 pb-10"
      >
        {/* Progress Bar */}
        <View className="flex-row space-x-2 mb-10 h-1.5">
          {[1, 2, 3].map((s) => (
            <View 
              key={s}
              className={`flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200'}`}
            />
          ))}
        </View>

        {/* Form Content */}
        <View className="flex-1">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        {/* Navigation Buttons */}
        <View className="mt-10 space-y-3">
          {step < 3 ? (
            <TouchableOpacity
              onPress={handleNext}
              className="bg-primary py-4 rounded-2xl flex-row justify-center items-center shadow-sm"
            >
              <Text className="text-white text-lg font-bold mr-2">Continue</Text>
              <ChevronRight size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-primary py-4 rounded-2xl flex-row justify-center items-center shadow-sm"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white text-lg font-bold mr-2">Complete Setup</Text>
                  <CheckCircle2 size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          )}

          {step > 1 && (
            <TouchableOpacity
              onPress={handleBack}
              className="py-3 flex-row justify-center items-center"
            >
              <ChevronLeft size={18} color="#6B7280" />
              <Text className="text-gray-500 font-medium ml-1">Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;

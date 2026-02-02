import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { supabase } from '../api/supabase';
import { getRecommendedRecipes, Recipe } from '../api/recipes';
import { scaleIngredientsForFamily } from '../utils/scaling';
import { Users, Flame, Heart, Info } from 'lucide-react-native';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserDataAndRecipes();
  }, []);

  const fetchUserDataAndRecipes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real app, we'd fetch from the 'profiles' table we discussed
      // For now, we'll use the metadata from the auth session
      const profile = {
        household_size: user.user_metadata.household_size || 1,
        medical_conditions: user.user_metadata.medical_conditions || [],
        disliked_foods: user.user_metadata.disliked_foods || [],
      };
      setUserProfile(profile);

      const recommended = await getRecommendedRecipes(
        profile.medical_conditions,
        profile.disliked_foods
      );
      setRecipes(recommended);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-16">
      <View className="mb-8">
        <Text className="text-gray-500 text-lg">Hello!</Text>
        <Text className="text-3xl font-bold text-gray-900">Your Weekly Plan</Text>
        <View className="flex-row items-center mt-2 bg-emerald-50 self-start px-3 py-1 rounded-full">
          <Users size={16} color="#059669" />
          <Text className="text-primary font-medium ml-2">
            Scaling for {userProfile?.household_size} {userProfile?.household_size === 1 ? 'person' : 'people'}
          </Text>
        </View>
      </View>

      <View className="space-y-6 pb-10">
        {recipes.length > 0 ? (
          recipes.map((recipe) => {
            const scaledIngredients = scaleIngredientsForFamily(
              recipe.ingredients,
              1, // Assuming base recipe is for 1
              userProfile?.household_size || 1
            );

            return (
              <TouchableOpacity 
                key={recipe.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
              >
                <View className="p-5">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900">{recipe.title}</Text>
                      <View className="flex-row flex-wrap gap-2 mt-2">
                        {recipe.medical_tags.map((tag) => (
                          <View key={tag} className="bg-blue-50 px-2 py-0.5 rounded-md">
                            <Text className="text-blue-600 text-xs font-semibold">{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View className="bg-amber-50 p-2 rounded-xl">
                      <Flame size={20} color="#f59e0b" />
                    </View>
                  </View>

                  <View className="border-t border-gray-50 pt-4 mt-2">
                    <Text className="text-sm font-bold text-gray-700 mb-2">
                      Ingredients (Scaled for Family)
                    </Text>
                    {scaledIngredients.slice(0, 3).map((ing, idx) => (
                      <Text key={idx} className="text-gray-500 text-sm">
                        • {ing.amount} {ing.unit} {ing.name}
                      </Text>
                    ))}
                    {scaledIngredients.length > 3 && (
                      <Text className="text-primary text-xs font-medium mt-1">
                        + {scaledIngredients.length - 3} more ingredients
                      </Text>
                    )}
                  </View>

                  <View className="flex-row items-center mt-4 bg-gray-50 p-3 rounded-2xl">
                    <Info size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-2 flex-1">
                      Nutrient density prioritized based on USDA standards for your health profile.
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="py-20 items-center">
            <Heart size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-center">
              No recipes found matching your criteria.{"\n"}Try adjusting your preferences!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

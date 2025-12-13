import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export default function EditProfileContent() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Will");
  const [lastName, setLastName] = useState("Hunting");
  const [zip, setZip] = useState("45801 Austin, TX");
  const [email, setEmail] = useState("myemail@hotmail.com");
  const [phoneNumber, setPhoneNumber] = useState("+1 (902) 123 45 67");
  const [cv, setCv] = useState<{ name: string; uri: string } | null>({
    name: "jimmy-white-CV.pdf",
    uri: "",
  });
  const [showGenericForm, setShowGenericForm] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [bio, setBio] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCv({
        name: result.assets[0].name,
        uri: result.assets[0].uri,
      });
    }
  };

  const removeCV = () => {
    setCv(null);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: Date.now().toString(),
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-4 pt-4">
          {/* Profile Picture */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Profile picture
            </Text>
            <Pressable onPress={pickImage} className="relative">
              <View className="w-16 h-16 rounded-full bg-azure-radiance-500 items-center justify-center">
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <Ionicons name="person" size={32} color="white" />
                )}
              </View>
              <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
                <Ionicons name="pencil" size={12} color="#6B7280" />
              </View>
            </Pressable>
          </View>

          {/* Personal Information */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Personal information
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-sm text-gray-700 mb-2">First name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                  placeholder="First name"
                />
              </View>

              <View>
                <Text className="text-sm text-gray-700 mb-2">Last name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                  placeholder="Last name"
                />
              </View>

              <View>
                <Text className="text-sm text-gray-700 mb-2">ZIP</Text>
                <TextInput
                  value={zip}
                  onChangeText={setZip}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                  placeholder="ZIP"
                />
              </View>

              <View>
                <Text className="text-sm text-gray-700 mb-2">Email</Text>
                <Text className="text-base text-gray-900 mb-1">{email}</Text>
                <Pressable>
                  <Text className="text-sm font-semibold text-azure-radiance-500">
                    Change email
                  </Text>
                </Pressable>
              </View>

              <View>
                <Text className="text-sm text-gray-700 mb-2">Phone number</Text>
                <Text className="text-base text-gray-900 mb-1">
                  {phoneNumber}
                </Text>
                <Pressable>
                  <Text className="text-sm font-semibold text-azure-radiance-500">
                    Change phone number
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* CV Section */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              CV
            </Text>

            {cv ? (
              <View className="flex-row items-center gap-3 p-4 bg-azure-radiance-50 rounded-xl border border-azure-radiance-100">
                <View className="w-12 h-12 bg-azure-radiance-100 rounded-lg items-center justify-center">
                  <Ionicons name="document-text" size={24} color="#1eadff" />
                </View>
                <Text className="flex-1 text-base text-gray-900 font-medium">
                  {cv.name}
                </Text>
                <Pressable onPress={removeCV}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable
                  onPress={pickDocument}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center mb-4"
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={48}
                    color="#9CA3AF"
                  />
                  <Text className="text-base font-semibold text-gray-900 mt-3">
                    Click to upload your CV
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    Max size 5 MB
                  </Text>
                </Pressable>

                <Text className="text-center text-sm text-gray-500 mb-4">
                  or
                </Text>

                <Pressable
                  onPress={() => setShowGenericForm(!showGenericForm)}
                  className="bg-azure-radiance-50 border border-azure-radiance-200 rounded-xl py-3 items-center"
                >
                  <Text className="text-base font-semibold text-azure-radiance-500">
                    Fill a generic application instead
                  </Text>
                </Pressable>
              </>
            )}

            {showGenericForm && !cv && (
              <View className="mt-4 p-4 bg-gray-50 rounded-xl">
                <Text className="text-sm text-gray-600">
                  Your employer will see a PDF with information you enter below.
                  If you'd like to upload your custom CV, click Upload a CV.
                </Text>
                <Pressable
                  onPress={pickDocument}
                  className="mt-3 bg-azure-radiance-500 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">Upload a CV</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Experience Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Experience
            </Text>

            {experiences.map((exp, index) => (
              <View
                key={exp.id}
                className="mb-4 p-4 border border-gray-200 rounded-xl"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-sm font-semibold text-gray-700">
                    Position {index + 1}
                  </Text>
                  <Pressable onPress={() => removeExperience(exp.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </Pressable>
                </View>

                <View className="gap-3">
                  <TextInput
                    placeholder="Position"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
                  />
                  <TextInput
                    placeholder="Company"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
                  />
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 mb-1">
                        Start date
                      </Text>
                      <View className="border border-gray-300 rounded-lg px-3 py-2 flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#9CA3AF"
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 mb-1">
                        End date
                      </Text>
                      <View className="border border-gray-300 rounded-lg px-3 py-2 flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#9CA3AF"
                        />
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Pressable className="w-5 h-5 border-2 border-gray-300 rounded" />
                    <Text className="text-sm text-gray-700">
                      My current position
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              onPress={addExperience}
              className="flex-row items-center gap-2 py-3"
            >
              <Ionicons name="add" size={20} color="#1eadff" />
              <Text className="text-base font-semibold text-azure-radiance-500">
                Add experience
              </Text>
            </Pressable>
          </View>

          {/* Education Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Education
            </Text>

            {educations.map((edu, index) => (
              <View
                key={edu.id}
                className="mb-4 p-4 border border-gray-200 rounded-xl"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-sm font-semibold text-gray-700">
                    Education {index + 1}
                  </Text>
                  <Pressable onPress={() => removeEducation(edu.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </Pressable>
                </View>

                <View className="gap-3">
                  <TextInput
                    placeholder="Degree"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
                  />
                  <TextInput
                    placeholder="Institution"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
                  />
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 mb-1">
                        Start date
                      </Text>
                      <View className="border border-gray-300 rounded-lg px-3 py-2 flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#9CA3AF"
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 mb-1">
                        End date
                      </Text>
                      <View className="border border-gray-300 rounded-lg px-3 py-2 flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#9CA3AF"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              onPress={addEducation}
              className="flex-row items-center gap-2 py-3"
            >
              <Ionicons name="add" size={20} color="#1eadff" />
              <Text className="text-base font-semibold text-azure-radiance-500">
                Add education
              </Text>
            </Pressable>
          </View>

          {/* Skills Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Skills</Text>

            <View className="flex-row flex-wrap gap-2 mb-3">
              {skills.map((skill, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-2 bg-azure-radiance-50 px-3 py-2 rounded-full"
                >
                  <Text className="text-sm text-gray-900">{skill}</Text>
                  <Pressable onPress={() => removeSkill(index)}>
                    <Ionicons name="close" size={16} color="#6B7280" />
                  </Pressable>
                </View>
              ))}
            </View>

            <View className="flex-row items-center gap-2">
              <TextInput
                value={skillInput}
                onChangeText={setSkillInput}
                placeholder="Type a skill"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
                onSubmitEditing={addSkill}
              />
              <Pressable
                onPress={addSkill}
                className="w-10 h-10 bg-azure-radiance-500 rounded-lg items-center justify-center"
              >
                <Ionicons name="add" size={20} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Bio Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Enter a short bio"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 min-h-[100px]"
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="bg-azure-radiance-500 h-12 rounded-xl flex-1 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Save changes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border-2 border-gray-200 bg-white h-12 rounded-xl flex-1 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

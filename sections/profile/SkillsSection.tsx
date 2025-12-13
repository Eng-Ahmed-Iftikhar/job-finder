import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFormikContext } from "formik";

interface FormValues {
  skills: string[];
  [key: string]: any;
}

export const SkillsSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formik.values.skills.includes(trimmedSkill)) {
      formik.setFieldValue("skills", [...formik.values.skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = formik.values.skills.filter(
      (_: any, i: number) => i !== index
    );
    formik.setFieldValue("skills", newSkills);
  };

  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Skills</Text>

      <View className="flex-row gap-2 mb-4">
        <TextInput
          value={skillInput}
          onChangeText={setSkillInput}
          placeholder="Add a skill"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholderTextColor="#999"
        />
        <Pressable
          onPress={addSkill}
          className="bg-azure-radiance-500 px-4 py-2 rounded-lg justify-center"
        >
          <Text className="text-white font-semibold">Add</Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {formik.values.skills && formik.values.skills.length > 0 ? (
          formik.values.skills.map((skill: string, index: number) => (
            <Pressable
              key={index}
              onPress={() => removeSkill(index)}
              className="bg-azure-radiance/20 border border-azure-radiance px-3 py-2 rounded-full flex-row items-center gap-2"
            >
              <Text className="text-azure-radiance font-medium">{skill}</Text>
              <Text className="text-azure-radiance font-bold">×</Text>
            </Pressable>
          ))
        ) : (
          <Text className="text-gray-500 text-sm italic">
            No skills added yet
          </Text>
        )}
      </View>

      {formik.touched.skills && formik.errors.skills && (
        <Text className="text-red-500 text-sm mt-2">
          {formik.errors.skills as string}
        </Text>
      )}
    </View>
  );
};

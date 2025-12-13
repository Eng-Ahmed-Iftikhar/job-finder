import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useFormikContext, FieldArray } from "formik";
import Input from "@/components/ui/Input";

interface FormValues {
  experiences: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
  }>;
  [key: string]: any;
}

export const ExperienceSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-800">Experience</Text>
      </View>

      <FieldArray name="experiences">
        {(arrayHelpers) => (
          <View>
            {formik.values.experiences &&
              formik.values.experiences.map(
                (experience: any, index: number) => (
                  <View
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                  >
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="font-semibold text-gray-800">
                        Experience {index + 1}
                      </Text>
                      <Pressable
                        onPress={() => arrayHelpers.remove(index)}
                        className="bg-red-100 px-3 py-1 rounded"
                      >
                        <Text className="text-red-600 font-semibold text-xs">
                          Remove
                        </Text>
                      </Pressable>
                    </View>

                    <View className="mb-3">
                      <Input
                        label="Position"
                        placeholder="e.g., Senior Developer"
                        value={experience.position}
                        onChangeText={formik.handleChange(
                          `experiences.${index}.position`
                        )}
                        onBlur={formik.handleBlur(
                          `experiences.${index}.position`
                        )}
                        error={
                          (formik.touched.experiences as any)?.[index]
                            ?.position &&
                          (formik.errors.experiences as any)?.[index]?.position
                            ? ((formik.errors.experiences as any)?.[index]
                                ?.position as string)
                            : undefined
                        }
                      />
                    </View>

                    <View className="mb-3">
                      <Input
                        label="Company"
                        placeholder="e.g., Tech Corp"
                        value={experience.company}
                        onChangeText={formik.handleChange(
                          `experiences.${index}.company`
                        )}
                        onBlur={formik.handleBlur(
                          `experiences.${index}.company`
                        )}
                        error={
                          (formik.touched.experiences as any)?.[index]
                            ?.company &&
                          (formik.errors.experiences as any)?.[index]?.company
                            ? ((formik.errors.experiences as any)?.[index]
                                ?.company as string)
                            : undefined
                        }
                      />
                    </View>

                    <View className="flex-row gap-3 mb-3">
                      <View className="flex-1">
                        <Input
                          label="Start Date"
                          placeholder="MM/YYYY"
                          value={experience.startDate}
                          onChangeText={formik.handleChange(
                            `experiences.${index}.startDate`
                          )}
                          onBlur={formik.handleBlur(
                            `experiences.${index}.startDate`
                          )}
                          error={
                            (formik.touched.experiences as any)?.[index]
                              ?.startDate &&
                            (formik.errors.experiences as any)?.[index]
                              ?.startDate
                              ? ((formik.errors.experiences as any)?.[index]
                                  ?.startDate as string)
                              : undefined
                          }
                        />
                      </View>
                      <View className="flex-1">
                        <Input
                          label="End Date"
                          placeholder="MM/YYYY"
                          value={experience.endDate}
                          editable={!experience.current}
                          onChangeText={formik.handleChange(
                            `experiences.${index}.endDate`
                          )}
                          onBlur={formik.handleBlur(
                            `experiences.${index}.endDate`
                          )}
                          error={
                            (formik.touched.experiences as any)?.[index]
                              ?.endDate &&
                            (formik.errors.experiences as any)?.[index]?.endDate
                              ? ((formik.errors.experiences as any)?.[index]
                                  ?.endDate as string)
                              : undefined
                          }
                        />
                      </View>
                    </View>

                    <Pressable
                      onPress={() =>
                        formik.setFieldValue(
                          `experiences.${index}.current`,
                          !experience.current
                        )
                      }
                      className="flex-row items-center"
                    >
                      <View
                        className={`w-5 h-5 rounded border-2 mr-2 ${
                          experience.current
                            ? "bg-azure-radiance-500 border-azure-radiance"
                            : "border-gray-300"
                        }`}
                      >
                        {experience.current && (
                          <Text className="text-white font-bold text-xs text-center">
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text className="text-gray-700">
                        Currently working here
                      </Text>
                    </Pressable>
                  </View>
                )
              )}

            <Pressable
              onPress={() =>
                arrayHelpers.push({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                })
              }
              className="bg-azure-radiance/10 border border-dashed border-azure-radiance p-4 rounded-lg"
            >
              <Text className="text-azure-radiance font-semibold text-center">
                + Add Experience
              </Text>
            </Pressable>
          </View>
        )}
      </FieldArray>
    </View>
  );
};

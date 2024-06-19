import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircleIcon, MapPinIcon } from "react-native-heroicons/solid";
import { ClockIcon } from "react-native-heroicons/outline";
import Loader from "@/components/Loader";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useCalendar from "@/hooks/useCalendar";
import { getMonthName, parseAndSortData } from "@/utils";
import { Status } from "../models/ChallengeData";

export default function Calendar() {
  const colorScheme = useColorScheme();
  const { data, loading } = useCalendar();

  const getStatusProps = (status: Status) => {
    switch (status) {
      case Status.Completed:
        return {
          cardBackgroundColor: Colors.calendar.completed,
          icon: (
            <CheckCircleIcon
              color={Colors.calendar.completed}
              size={15}
            ></CheckCircleIcon>
          ),
        };
      case Status.Scheduled:
        return {
          cardBackgroundColor: Colors.calendar.scheduled,
          icon: (
            <ClockIcon color={Colors.calendar.completed} size={15}></ClockIcon>
          ),
        };
      case Status.Unscheduled:
        return {
          cardBackgroundColor: Colors.calendar.unscheduled,
          icon: null,
        };
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.contentContainer}>
      <ScrollView
        style={[
          styles.scrollviewContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        {data &&
          parseAndSortData(data).map((monthData) => (
            <View
              key={`${monthData.year}-${monthData.month}`}
              style={styles.rowGap}
            >
              <View style={styles.monthYearTitleContainer}>
                <Text style={styles.monthYearTitle}>
                  {getMonthName(monthData.month)} {monthData.year}
                </Text>
              </View>
              {monthData.actions.length > 0 ? (
                monthData.actions.map((action) => (
                  <View key={action.id} style={styles.rowMainContainer}>
                    <View style={styles.leftContentContainer}>
                      {action.status === Status.Unscheduled ? (
                        <Text style={styles.leftContentLabel}>TBD</Text>
                      ) : (
                        <>
                          <Text style={styles.leftContentLabel}>
                            {action.dayName?.slice(0, 3).toUpperCase()}
                          </Text>
                          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {action.scheduledDate?.getDay()}
                          </Text>
                          <View style={styles.rowGap}>
                            {getStatusProps(action.status).icon}
                          </View>
                        </>
                      )}
                    </View>
                    {/* END LEFT CONTAINER */}
                    {/* RIGHT CONTAINER */}
                    <View
                      style={[
                        styles.rightContentContainer,
                        {
                          backgroundColor: getStatusProps(action.status)
                            .cardBackgroundColor,
                        },
                      ]}
                    >
                      <View style={{ flexDirection: "column" }}>
                        <Text style={[styles.whiteBoldFont, styles.font16]}>
                          {action.name}
                        </Text>
                        {action.vendor ? (
                          <>
                            <Text
                              style={[styles.whiteRegularFont, styles.font12]}
                            >
                              {action.vendor.vendorName}
                            </Text>
                            <Text style={[styles.whiteBoldFont, styles.font12]}>
                              {action.vendor.phoneNumber}
                            </Text>
                          </>
                        ) : null}
                        <View style={styles.rightContent__bottomContainer}>
                          <View style={styles.rightContent__locationContainer}>
                            <MapPinIcon color={"white"} size={12} />
                            <Text
                              style={[styles.whiteRegularFont, styles.font12]}
                            >
                              {" "}
                              {data.customer?.street}
                            </Text>
                          </View>
                          <Text
                            style={[styles.whiteRegularFont, styles.font12]}
                          >
                            {action.status}{" "}
                            {action.status === Status.Scheduled &&
                              `${action.arrivalStartWindow} - ${action.arrivalEndWindow}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* END RIGHT CONTAINER */}
                  </View>
                ))
              ) : (
                // NO SCHEDULE COMPONENT
                <View style={styles.rowMainContainer}>
                  <View style={styles.helperView} />
                  <View style={styles.emptyStateContainer}>
                    <Text style={[styles.whiteBoldFont, styles.font16]}>
                      No Maintenance Scheduled
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rightContent__locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContent__bottomContainer: {
    paddingTop: 10,
  },
  leftContentLabel: {
    fontSize: 9,
    opacity: 0.6,
  },
  rowGap: {
    paddingVertical: 4,
  },
  rowMainContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 4,
  },
  leftContentContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rightContentContainer: {
    flexDirection: "row",
    flexGrow: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  whiteRegularFont: {
    fontWeight: "regular",
    color: "white",
  },
  contentContainer: {
    flexGrow: 1,
  },
  scrollviewContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  monthYearTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  monthYearTitleContainer: {
    paddingVertical: 20,
  },
  whiteBoldFont: {
    color: "white",
    fontWeight: "bold",
  },
  font16: {
    fontSize: 16,
  },
  font12: {
    fontSize: 12,
  },
  helperView: {
    width: "5%",
  },
  emptyStateContainer: {
    flexDirection: "row",
    backgroundColor: Colors.calendar.emptyState,
    borderRadius: 4,
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

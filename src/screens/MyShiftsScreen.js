import React, { useCallback } from 'react';

import {
  ActivityIndicator,
  SectionList,
} from 'react-native';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  useFocusEffect,
} from '@react-navigation/native';

import styled from 'styled-components/native';

import {
  fetchShifts,
  cancelShift,
} from '../api';

import {
  groupShiftsByDate,
} from '../utils';

import ShiftAssistant from '../components/ShiftAssistant';

const COLORS = {
  background: '#F5F1E8',
  card: '#FFFDF8',
  navy: '#173F5F',
  blue: '#4F7CAC',
  green: '#5F8D68',
  greenLight: '#EDF5EE',
  red: '#C65D5D',
  redLight: '#FBEDED',
  text: '#243447',
  muted: '#718096',
  border: '#E6DED0',
  white: '#FFFFFF',
};

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.background};
`;

const Header = styled.View`
  background-color: ${COLORS.card};
  padding: 22px 22px 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.border};
`;

const Eyebrow = styled.Text`
  font-size: 11px;
  font-weight: 800;
  color: ${COLORS.blue};
  letter-spacing: 1px;
  margin-bottom: 7px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${COLORS.navy};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${COLORS.muted};
  margin-top: 5px;
  line-height: 20px;
`;

const NavigationArea = styled.View`
  padding: 14px 16px 5px;
  background-color: ${COLORS.background};
`;

const NavigationBox = styled.View`
  flex-direction: row;
  padding: 4px;
  background-color: #E9E2D5;
  border-radius: 15px;
`;

const NavigationButton = styled.TouchableOpacity`
  flex: 1;
  height: 46px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.active ? COLORS.navy : 'transparent'};
`;

const NavigationButtonText = styled.Text`
  font-size: 13px;
  font-weight: 800;
  color: ${props =>
    props.active ? COLORS.white : COLORS.muted};
`;

const SummaryCard = styled.View`
  margin: 14px 14px 5px;
  padding: 18px;
  border-radius: 17px;
  background-color: ${COLORS.navy};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SummaryInfo = styled.View`
  flex: 1;
`;

const SummaryLabel = styled.Text`
  font-size: 11px;
  font-weight: 800;
  color: #DCE8F1;
  letter-spacing: 1px;
`;

const SummaryNumber = styled.Text`
  font-size: 30px;
  font-weight: 800;
  color: ${COLORS.white};
  margin-top: 2px;
`;

const SummaryDescription = styled.Text`
  font-size: 12px;
  color: #DCE8F1;
  margin-top: 1px;
`;

const SummaryIcon = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: rgba(255, 255, 255, 0.13);
  align-items: center;
  justify-content: center;
`;

const SummaryIconText = styled.Text`
  font-size: 25px;
  color: ${COLORS.white};
`;

const DateHeader = styled.Text`
  font-size: 15px;
  font-weight: 800;
  color: ${COLORS.navy};
  padding: 16px 20px 10px;
`;

const ShiftCard = styled.View`
  margin: 0 14px 11px;
  padding: 17px;
  background-color: ${COLORS.card};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${COLORS.border};
  shadow-color: #4A4036;
  shadow-opacity: 0.07;
  shadow-radius: 7px;
  shadow-offset: 0px 3px;
  elevation: 2px;
`;

const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const ShiftInfo = styled.View`
  flex: 1;
  padding-right: 12px;
`;

const TimeRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TimeIcon = styled.Text`
  font-size: 17px;
  color: ${COLORS.blue};
  margin-right: 7px;
`;

const TimeText = styled.Text`
  font-size: 19px;
  font-weight: 800;
  color: ${COLORS.text};
`;

const AreaRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 7px;
`;

const AreaIcon = styled.Text`
  font-size: 15px;
  color: ${COLORS.muted};
  margin-right: 6px;
`;

const AreaText = styled.Text`
  font-size: 14px;
  color: ${COLORS.muted};
`;

const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${COLORS.green};
  margin-right: 7px;
`;

const StatusText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${COLORS.green};
`;

const CancelButton = styled.TouchableOpacity`
  min-width: 96px;
  min-height: 42px;
  padding: 9px 14px;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.redLight};
  border-width: 1px;
  border-color: ${COLORS.red};
  opacity: ${props =>
    props.disabled ? 0.5 : 1};
`;

const CancelText = styled.Text`
  font-size: 13px;
  font-weight: 800;
  color: ${COLORS.red};
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 30px;
`;

const EmptyIcon = styled.View`
  width: 74px;
  height: 74px;
  border-radius: 37px;
  background-color: #E8E2D6;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

const EmptyIconText = styled.Text`
  font-size: 30px;
  color: ${COLORS.muted};
`;

const EmptyTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${COLORS.text};
  text-align: center;
`;

const EmptyText = styled.Text`
  font-size: 14px;
  color: ${COLORS.muted};
  text-align: center;
  margin-top: 8px;
  line-height: 21px;
`;

export default function MyShiftsScreen({
  navigation,
}) {
  const queryClient = useQueryClient();

  const {
    data: shifts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['shifts'],
    queryFn: fetchShifts,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const cancelMutation = useMutation({
    mutationFn: cancelShift,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shifts'],
      });

      refetch();
    },
  });

  const bookedShifts =
    shifts.filter(
      shift => shift.booked
    );

  const groupedShifts =
    groupShiftsByDate(bookedShifts);

  const formatTime = time =>
    new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator
          size="large"
          color={COLORS.navy}
          style={{ flex: 1 }}
        />
      </Container>
    );
  }

  return (
    <Container>

      <Header>

        <Eyebrow>
          YOUR SCHEDULE
        </Eyebrow>

        <Title>
          My Shifts
        </Title>

        <Subtitle>
          Manage your upcoming scheduled shifts.
        </Subtitle>

      </Header>

      <NavigationArea>
        <NavigationBox>

          <NavigationButton
            active={false}
            onPress={() =>
              navigation.navigate(
                'Available Shifts'
              )
            }
          >
            <NavigationButtonText active={false}>
              AVAILABLE SHIFTS
            </NavigationButtonText>
          </NavigationButton>

          <NavigationButton
            active={true}
            onPress={() => {}}
          >
            <NavigationButtonText active={true}>
              MY SHIFTS
            </NavigationButtonText>
          </NavigationButton>

        </NavigationBox>
      </NavigationArea>

      {bookedShifts.length === 0 ? (

        <EmptyContainer>

          <EmptyIcon>
            <EmptyIconText>
              ◷
            </EmptyIconText>
          </EmptyIcon>

          <EmptyTitle>
            No booked shifts
          </EmptyTitle>

          <EmptyText>
            You don't have any booked shifts
            yet. Explore available shifts and
            choose one that works for you.
          </EmptyText>

        </EmptyContainer>

      ) : (

        <SectionList
          sections={groupedShifts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}

          ListHeaderComponent={
            <SummaryCard>

              <SummaryInfo>

                <SummaryLabel>
                  BOOKED SHIFTS
                </SummaryLabel>

                <SummaryNumber>
                  {bookedShifts.length}
                </SummaryNumber>

                <SummaryDescription>
                  Upcoming shifts in your schedule
                </SummaryDescription>

              </SummaryInfo>

              <SummaryIcon>
                <SummaryIconText>
                  ✓
                </SummaryIconText>
              </SummaryIcon>

            </SummaryCard>
          }

          renderSectionHeader={({
            section: { title },
          }) => (
            <DateHeader>
              {title}
            </DateHeader>
          )}

          renderItem={({ item }) => (

            <ShiftCard>

              <TopRow>

                <ShiftInfo>

                  <TimeRow>

                    <TimeIcon>
                      ◷
                    </TimeIcon>

                    <TimeText>
                      {formatTime(
                        item.startTime
                      )}
                      {' - '}
                      {formatTime(
                        item.endTime
                      )}
                    </TimeText>

                  </TimeRow>

                  <AreaRow>

                    <AreaIcon>
                      ◉
                    </AreaIcon>

                    <AreaText>
                      {item.area}
                    </AreaText>

                  </AreaRow>

                  <StatusRow>

                    <StatusDot />

                    <StatusText>
                      Booked & confirmed
                    </StatusText>

                  </StatusRow>

                </ShiftInfo>

                <CancelButton
                  disabled={
                    cancelMutation.isPending
                  }
                  onPress={() =>
                    cancelMutation.mutate(
                      item.id
                    )
                  }
                >
                  <CancelText>
                    Cancel
                  </CancelText>
                </CancelButton>

              </TopRow>

            </ShiftCard>

          )}

        />

      )}

      {/* Same assistant and same position as Available Shifts */}
      <ShiftAssistant />

    </Container>
  );
}
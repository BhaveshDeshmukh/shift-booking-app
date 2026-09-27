import React, { useState } from 'react';
import {
  SectionList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import styled from 'styled-components/native';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  fetchShifts,
  bookShift,
  cancelShift,
} from '../api';

import { groupShiftsByDate } from '../utils';

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
  padding: 20px 22px 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.border};
`;

const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

const Logo = styled.Image`
  width: 92px;
  height: 58px;
  resize-mode: contain;
`;

const BrandDivider = styled.View`
  width: 1px;
  height: 38px;
  background-color: ${COLORS.border};
  margin-left: 12px;
  margin-right: 12px;
`;

const BrandInfo = styled.View`
  flex: 1;
`;

const BrandName = styled.Text`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  color: ${COLORS.navy};
`;

const BrandCaption = styled.Text`
  font-size: 11px;
  color: ${COLORS.muted};
  margin-top: 3px;
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

const FilterArea = styled.View`
  padding: 14px 16px 4px;
  background-color: ${COLORS.background};
`;

const FilterTitle = styled.Text`
  font-size: 11px;
  font-weight: 800;
  color: ${COLORS.muted};
  margin-left: 4px;
  margin-bottom: 9px;
  letter-spacing: 0.8px;
`;

const FilterScroll = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

const FilterButton = styled.TouchableOpacity`
  padding: 9px 17px;
  margin-right: 8px;
  border-radius: 22px;
  background-color: ${props =>
    props.active ? COLORS.navy : COLORS.card};
  border-width: 1px;
  border-color: ${props =>
    props.active ? COLORS.navy : COLORS.border};
`;

const FilterText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${props =>
    props.active ? COLORS.white : COLORS.muted};
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
  background-color: ${props =>
    props.booked ? COLORS.red : COLORS.green};
  margin-right: 7px;
`;

const StatusText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${props =>
    props.booked ? COLORS.red : COLORS.green};
`;

const ActionButton = styled.TouchableOpacity`
  min-width: 96px;
  min-height: 42px;
  padding: 9px 14px;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.booked ? COLORS.redLight : COLORS.greenLight};
  border-width: 1px;
  border-color: ${props =>
    props.booked ? COLORS.red : COLORS.green};
  opacity: ${props =>
    props.disabled ? 0.5 : 1};
`;

const ActionText = styled.Text`
  font-size: 13px;
  font-weight: 800;
  color: ${props =>
    props.booked ? COLORS.red : COLORS.green};
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

export default function AvailableShiftsScreen({
  navigation,
}) {
  const [selectedCity, setSelectedCity] =
    useState('');

  const queryClient = useQueryClient();

  const {
    data: shifts = [],
    isLoading,
  } = useQuery({
    queryKey: ['shifts'],
    queryFn: fetchShifts,
  });

  const bookMutation = useMutation({
    mutationFn: bookShift,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shifts'],
      });
    },

    onError: error => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'This shift could not be booked. It may overlap with another booked shift.';

      Alert.alert(
        'Unable to book shift',
        message
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelShift,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shifts'],
      });
    },

    onError: error => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'This shift could not be cancelled.';

      Alert.alert(
        'Unable to cancel shift',
        message
      );
    },
  });

  const cities = [
    ...new Set(
      shifts.map(shift => shift.area)
    ),
  ];

  const filteredShifts = selectedCity
    ? shifts.filter(
        shift => shift.area === selectedCity
      )
    : shifts;

  const groupedShifts =
    groupShiftsByDate(filteredShifts);

  const formatTime = time =>
    new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const handleAction = item => {
    if (
      bookMutation.isPending ||
      cancelMutation.isPending
    ) {
      return;
    }

    if (item.booked) {
      cancelMutation.mutate(item.id);
    } else {
      bookMutation.mutate(item.id);
    }
  };

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
        <BrandRow>

          <Logo
            source={require('../../assets/img1.jpg')}
          />

          <BrandDivider />

          <BrandInfo>
            <BrandName>
              KIRAN FOUNDATION
            </BrandName>

            <BrandCaption>
              Volunteer Shift Management
            </BrandCaption>
          </BrandInfo>

        </BrandRow>

        <Title>
          Available Shifts
        </Title>

        <Subtitle>
          Find a shift that fits your schedule
          and make a difference.
        </Subtitle>
      </Header>

      <NavigationArea>
        <NavigationBox>

          <NavigationButton
            active={true}
            onPress={() => {}}
          >
            <NavigationButtonText active={true}>
              AVAILABLE SHIFTS
            </NavigationButtonText>
          </NavigationButton>

          <NavigationButton
            active={false}
            onPress={() =>
              navigation.navigate('My Shifts')
            }
          >
            <NavigationButtonText active={false}>
              MY SHIFTS
            </NavigationButtonText>
          </NavigationButton>

        </NavigationBox>
      </NavigationArea>

      <FilterArea>

        <FilterTitle>
          FILTER BY LOCATION
        </FilterTitle>

        <FilterScroll>

          <FilterButton
            active={selectedCity === ''}
            onPress={() =>
              setSelectedCity('')
            }
          >
            <FilterText
              active={selectedCity === ''}
            >
              All locations
            </FilterText>
          </FilterButton>

          {cities.map(city => (
            <FilterButton
              key={city}
              active={selectedCity === city}
              onPress={() =>
                setSelectedCity(city)
              }
            >
              <FilterText
                active={selectedCity === city}
              >
                {city}
              </FilterText>
            </FilterButton>
          ))}

        </FilterScroll>

      </FilterArea>

      <SectionList
        sections={groupedShifts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}

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

                  <StatusDot
                    booked={item.booked}
                  />

                  <StatusText
                    booked={item.booked}
                  >
                    {item.booked
                      ? 'Already booked'
                      : 'Available to book'}
                  </StatusText>

                </StatusRow>

              </ShiftInfo>

              <ActionButton
                booked={item.booked}
                disabled={
                  bookMutation.isPending ||
                  cancelMutation.isPending
                }
                onPress={() =>
                  handleAction(item)
                }
              >
                <ActionText
                  booked={item.booked}
                >
                  {item.booked
                    ? 'Cancel'
                    : 'Book shift'}
                </ActionText>
              </ActionButton>

            </TopRow>

          </ShiftCard>
        )}

        ListEmptyComponent={
          <EmptyContainer>

            <EmptyIcon>
              <EmptyIconText>
                ◷
              </EmptyIconText>
            </EmptyIcon>

            <EmptyTitle>
              No shifts found
            </EmptyTitle>

            <EmptyText>
              There are no available shifts
              for this location right now.
              Try another location.
            </EmptyText>

          </EmptyContainer>
        }
      />

      {/* Same floating assistant on every screen */}
      <ShiftAssistant />

    </Container>
  );
}
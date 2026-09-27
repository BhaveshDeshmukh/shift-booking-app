import React, { useState } from 'react';
import styled from 'styled-components/native';

const COLORS = {
  navy: '#173F5F',
  blue: '#4F7CAC',
  background: '#FFFDF8',
  cream: '#F5F1E8',
  text: '#243447',
  muted: '#718096',
  border: '#E6DED0',
  white: '#FFFFFF',
};

const AssistantContainer = styled.View`
  position: absolute;
  right: 18px;
  bottom: 22px;
  align-items: flex-end;
  z-index: 1000;
`;

const HelpButton = styled.TouchableOpacity`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${COLORS.navy};
  align-items: center;
  justify-content: center;
  shadow-color: #000000;
  shadow-opacity: 0.18;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 7px;
`;

const HelpIcon = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${COLORS.white};
`;

const HelpPanel = styled.View`
  width: 300px;
  margin-bottom: 12px;
  background-color: ${COLORS.background};
  border-radius: 18px;
  border-width: 1px;
  border-color: ${COLORS.border};
  overflow: hidden;
  shadow-color: #000000;
  shadow-opacity: 0.16;
  shadow-radius: 12px;
  shadow-offset: 0px 5px;
  elevation: 9px;
`;

const PanelHeader = styled.View`
  background-color: ${COLORS.navy};
  padding: 16px 17px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderInfo = styled.View`
  flex: 1;
`;

const PanelTitle = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: ${COLORS.white};
`;

const PanelSubtitle = styled.Text`
  font-size: 11px;
  color: #DCE8F1;
  margin-top: 3px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.12);
  align-items: center;
  justify-content: center;
`;

const CloseText = styled.Text`
  font-size: 18px;
  color: ${COLORS.white};
`;

const QuestionArea = styled.View`
  padding: 12px;
`;

const QuestionButton = styled.TouchableOpacity`
  padding: 13px 14px;
  margin-bottom: 8px;
  border-radius: 12px;
  background-color: ${COLORS.cream};
  border-width: 1px;
  border-color: ${COLORS.border};
`;

const QuestionText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${COLORS.text};
  line-height: 19px;
`;

const AnswerBox = styled.View`
  padding: 13px 14px;
  margin-bottom: 8px;
  border-radius: 12px;
  background-color: #EDF5EE;
  border-width: 1px;
  border-color: #D6E6D8;
`;

const AnswerText = styled.Text`
  font-size: 13px;
  color: ${COLORS.text};
  line-height: 19px;
`;

const BackButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

const BackText = styled.Text`
  font-size: 12px;
  font-weight: 800;
  color: ${COLORS.blue};
`;

export default function ShiftAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const questions = [
    {
      id: 'book',
      question: 'How do I book a shift?',
      answer:
        'Choose a location, find an available shift, and tap “Book shift”. Your booking will be added to your schedule.',
    },
    {
      id: 'cancel',
      question: 'How do I cancel a shift?',
      answer:
        'Open My Shifts and tap “Cancel” on the shift you want to remove from your schedule.',
    },
    {
      id: 'unable',
      question: "Why can't I book a shift?",
      answer:
        'A shift may already be booked, already started, or overlap with another shift you have booked.',
    },
    {
      id: 'schedule',
      question: 'Where can I see my shifts?',
      answer:
        'Tap “MY SHIFTS” at the top of the screen to view your confirmed upcoming shifts.',
    },
  ];

  const handleQuestion = question => {
    setSelectedQuestion(question);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <AssistantContainer>

      {isOpen && (
        <HelpPanel>

          <PanelHeader>

            <HeaderInfo>
              <PanelTitle>
                ✦ Shift Assistant
              </PanelTitle>

              <PanelSubtitle>
                Quick help with your shifts
              </PanelSubtitle>
            </HeaderInfo>

            <CloseButton
              onPress={handleClose}
            >
              <CloseText>
                ×
              </CloseText>
            </CloseButton>

          </PanelHeader>

          <QuestionArea>

            {selectedQuestion ? (
              <>

                <AnswerBox>
                  <AnswerText>
                    {selectedQuestion.answer}
                  </AnswerText>
                </AnswerBox>

                <BackButton
                  onPress={() =>
                    setSelectedQuestion(null)
                  }
                >
                  <BackText>
                    ← Back to questions
                  </BackText>
                </BackButton>

              </>
            ) : (
              <>
                {questions.map(question => (
                  <QuestionButton
                    key={question.id}
                    onPress={() =>
                      handleQuestion(question)
                    }
                  >
                    <QuestionText>
                      {question.question}
                    </QuestionText>
                  </QuestionButton>
                ))}
              </>
            )}

          </QuestionArea>

        </HelpPanel>
      )}

      <HelpButton
        onPress={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        accessibilityLabel="Open shift assistant"
      >
        <HelpIcon>
          {isOpen ? '×' : '?'}
        </HelpIcon>
      </HelpButton>

    </AssistantContainer>
  );
}
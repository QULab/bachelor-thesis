import React, { Fragment } from 'react'
import '../styles/Questions.css'

const allQuestions = [
  {
    key: 'q0',
    label: 'Is this the first question?',
    answers: [
      { label: 'yes', value: 'y' },
      { label: 'no', value: 'n' },
      { label: 'why do you need three possible answers?', value: 'why' },
      { label: "fuck the binary, that's why", value: 'nb' },
    ],
    horizontalAnswers: false,
  },
  {
    key: 'q1',
    label: 'Do you know what happens when I add more questions?',
    answers: [
      { label: 'yes', value: 'y' },
      { label: 'no', value: 'n' },
      { label: "I don't even care", value: 'idc' },
    ],
    horizontalAnswers: false,
  },
  {
    key: 'q2',
    label: 'Question?',
    answers: [
      { label: 'answer 1', value: 1 },
      { label: 'answer 2', value: 2 },
      { label: 'answer 3', value: 3 },
      { label: 'answer 4', value: 4 },
      { label: 'answer 5', value: 5 },
      { label: 'answer 6', value: 6 },
    ],
    horizontalAnswers: false,
  },
  {
    key: 'q3',
    label: 'Did you have to scroll to see this?',
    answers: [
      { label: 'Yes', value: 'y' },
      { label: 'No, your site is broken', value: 'damn' },
      { label: 'No, I have a big screen', value: 'big' },
      { label: "I can't see this", value: 'what' },
    ],
    horizontalAnswers: false,
  },
  {
    key: 'q4',
    label: 'Did you know I can also arrange the answers differently?',
    answers: [
      { label: 'Yes', value: 'y' },
      { label: '', value: 'y-idk' },
      { label: "I don't know", value: 'idk' },
      { label: '', value: 'idk-n' },
      { label: 'No', value: 'n' },
    ],
    horizontalAnswers: true,
  },
]

const Questions = props => {
  return (
    <Fragment>
      <div>Now answer some questions about what you just read</div>
      {allQuestions.map(({ key, label, answers, horizontalAnswers }) => (
        <Fragment key={`question-${key}`}>
          <div className="question-box">
            <div>
              <strong>{label}</strong>
            </div>
            <div
              className={`${horizontalAnswers ? 'horizontal-answer-box' : ''}`}
            >
              {answers.map(({ label, value }, i) => {
                return (
                  <div
                    key={`${key}-${value}`}
                    className={`${
                      horizontalAnswers ? 'horizontal-answer' : ''
                    }`}
                  >
                    <input
                      onChange={() => props.onChange(key, value)}
                      type="radio"
                      name={key}
                      id={`${key}-${value}`}
                      value={value}
                      checked={value === props.answers[key]}
                    />
                    {horizontalAnswers ? <br /> : null}
                    <label htmlFor={`${key}-${value}`}>{label}</label>
                  </div>
                )
              })}
            </div>
          </div>
        </Fragment>
      ))}
    </Fragment>
  )
}

export default Questions

import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { databasePropType } from '../lib/prop-types'
import createStore from '../lib/create-store'
import { Link, withRouter } from 'react-router-dom'
import '../styles/Instructions.css'
import {
  CONTACT_MAIL,
  COMPENSATION,
  SESSIONS_PER_COMPENSATION,
  SESSION_DURATION,
} from '../config.js'

const participantId = createStore('participantId')

const Instructions = props => {
  const doesIdExist = id => {
    return pouchParticipants
      .get(id)
      .then(() => {
        return { exists: true }
      })
      .catch(response => {
        return { exists: false, status: response.status }
      })
  }

  const { pouchParticipants } = props

  const [error, setError] = useState('')
  const [isNewParticipantFromParams, setIsNewParticipantFromParams] = useState(
    false
  )
  const loggedInId = participantId.get()

  useEffect(() => {
    if (loggedInId) {
      doesIdExist(loggedInId).then(({ exists }) =>
        setIsNewParticipantFromParams(!exists)
      )
    }
  }, [])

  return (
    <Fragment>
      <div className="tu-border tu-glow center-box ">
        <div className="centered-content">
          <h2>Instructions</h2>
        </div>
        <p>
          Please read this page carefully and make sure you understand what
          you are supposed to do.
        </p>
        <p>
          This study is part of a project in which we want to assess the
		  complexity and understandability of German text paragraphs.
        </p>
        <p>
          You will read texts and answer questions about the
          complexity and understandability. Each survey will take about {SESSION_DURATION} minutes to
          complete and consists of two paragraphs, for each of which you will be
          led through the following three steps:
        </p>
        <h5>1. Reading</h5>
        <p>
          In the first step you can <strong>read the text</strong> that you will
          be rating.
        </p>
        <p>
          We will measure how long it takes to read a paragraph, so the
          text will be hidden unless you hold a button below the text. Please
          make sure you read the entire paragraph and understand it as well as
          you can.
        </p>
        <p>
          Once you are done, click on "Next Step".{' '}
          <strong>
            After that, you will not be able to go back to read the text.
          </strong>
        </p>
        <h5>2. Questions</h5>
        <p>
          In the second step you will be asked{' '}
          <strong>questions about the text</strong>, for example how complex you
          think it is or how well you understood it.
        </p>
        <h5>3. Cloze Test</h5>
        <p>
          In the last step you will see the text again, but with several words
          left out. Please <strong>select the missing words</strong> from the
          dropdown menus.
        </p>
        <h5>Finish</h5>
        <p>
          After you complete the rating for one text, you will get the next
		  paragraph and can start the rating of that text. After
          completing both texts of a survey, your answers will be saved and you
          will be redirected to the homepage.
        </p>
        <h5>Compensation</h5>
        <p>
          After completing a session you will get a code. Please fill in this code in 
		  the Microworker's campaign to prove a successfully completed job.
        </p>
        <p>
          <strong>Remember:</strong> There are{' '}
          <strong>no right or wrong answers</strong> as long as you read the
          text carefully, follow the instructions and give your honest opinion.
          In case you get tired or cannot focus for any reason, take a break and
          come back later.
        </p>
        {loggedInId !== null ? (
          <Link
            className="btn"
            to={isNewParticipantFromParams ? '/demographics' : '/start-session'}
          >
            Start
          </Link>
        ) : (
          <Fragment>
            <p>
              If this is your first time participating in this study and you
              do not have an ID yet, please click here:
            </p>
            <Link className="btn" to="/demographics">
              New Participant
            </Link>
            <p>
              If you have already done a session in the past, please enter your
              participant ID and click "Start"
            </p>
            <form
              onSubmit={e => {
                e.preventDefault()
                const id = e.target.participantId.value
                doesIdExist(id).then(result => {
                  if (result.exists) {
                    props.login(id)
                    props.history.push('/start-session')
                  } else if (result.status === 404) {
                    setError(
                      'This ID does not exist. Please make sure you entered the correct ID.'
                    )
                  } else {
                    setError('An unknown error occurred. Please try again.')
                  }
                })
              }}
            >
              <input
                type="text"
                name="participantId"
                placeholder="Participant ID"
                className="login-input"
              />
              <button type="submit" className="btn">
                Start
              </button>
            </form>
            {error.length > 0 ? (
              <div className="tu-border error-box background-pink">{error}</div>
            ) : null}
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

Instructions.propTypes = {
  pouchParticipants: databasePropType,
  login: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func }),
}

export default withRouter(Instructions)

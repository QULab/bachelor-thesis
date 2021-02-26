import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { databasePropType } from '../lib/prop-types'
import { Link } from 'react-router-dom'
import Popup from './Popup'
import Timer from 'react-compound-timer'
import createStore from '../lib/create-store'
import getFromUrlParams from '../lib/get-from-url-params'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import '../styles/StartSession.css'
import {
  COMPENSATION,
  CONTACT_MAIL,
  SESSIONS_PER_COMPENSATION,
} from '../config.js'

const participantStore = createStore('participantId')
const sessionStore = createStore('session')
const ratingStore = createStore('ratings')
const seedStore = createStore('seed')
const itemDataStore = createStore('itemData', {
  deleteAfterSession: true,
})
const chainStartStore = createStore('chainStart')
const chainAmountStore = createStore('chainAmount')

class StartSession extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      completedTrainingSession: false,
      seed: seedStore.get(),
    }

    // check if too many sessions have been done in a row and, if so, force a break

    const maxChainLengthAllowed = 3
    const consecutiveSessions = chainAmountStore.get()

    if (this.isPartOfChain() && consecutiveSessions >= maxChainLengthAllowed) {
      this.state.tooManyConsecutiveSessions = true
    }
  }

  async componentDidMount() {
    let newState = {}

    newState.previousSession = getFromUrlParams('prev', this.props)
    newState.token = getFromUrlParams('token', this.props)

    const activeSession = sessionStore.get()
    newState.hasActiveSession = activeSession && activeSession.id !== 'Training'

    const { pouchParticipants } = this.props
    const participantId = participantStore.get()
    const participant = await pouchParticipants.get(participantId)
    this.setState({
      ...newState,
      completedTrainingSession:
        Boolean(participant.completedTrainingSession) ||
        newState.previousSession === 'Training',
    })
  }

  deleteActiveSession() {
    if (this.state.hasActiveSession) {
      sessionStore.clear()
      ratingStore.clear()
      itemDataStore.clear()
    }
  }

  isPartOfChain() {
    const chainStart = chainStartStore.get()
    const chainAmount = chainAmountStore.get()

    if (!chainStart || !chainAmount) {
      return false
    }

    const minDifferenceExpected = chainAmount * 6 // 6 minutes per session
    const chainStartDate = new Date(chainStart).getTime()
    const now = new Date().getTime()
    const difference = (now - chainStartDate) / (1000 * 60) // difference in minutes

    return difference <= minDifferenceExpected
  }

  renderThankYou() {
    const { previousSession } = this.state

    const previouslyTraining = previousSession === 'Training'
    const previouslyFeedback = previousSession === 'Feedback'
    const previouslyRating =
      previousSession && !previouslyTraining && !previouslyFeedback
    const allowAnotherSession = !this.state.seed

    if (previouslyTraining) {
      return (
        <Fragment>
          <div>
            <span>
              You have successfully submitted your test rating.{' '}
              <strong>You can now start an actual survey below.</strong>{' '}
            </span>
            <span>
              If you have any questions, you can read the{' '}
              <a href="/instructions">Instructions</a> again or contact us at{' '}
              <a href={`mailto:${CONTACT_MAIL}`} target="blank">
                {CONTACT_MAIL}
              </a>
              .{' '}
            </span>
          </div>
          <div>
            We would also appreciate some <a href="/feedback">feedback</a> on
            the study, so that we can improve it in the future.
          </div>
        </Fragment>
      )
    }

    if (previouslyFeedback) {
      return (
        <span>
          Thank you for your feedback, this helps us improve the study in the
          future!
        </span>
      )
    }

    if (previouslyRating) {
      return (
        <Fragment>
          {this.state.token ? (
            <Fragment>
              <p>
                Thank you! Your answers have been saved. Your confirmation code
                is
              </p>
              <div className="tu-border confirmation-token">
                <strong>{this.state.token}</strong>
                <span className="token-copy">
                  {this.state.tokenCopied ? (
                    <span className="tu-red" aria-label="Success">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </span>
                  ) : (
                    <span
                      aria-label="Copy"
                      onClick={() => {
                        navigator.clipboard.writeText(this.state.token)
                        this.setState({ tokenCopied: true })
                      }}
                      className="tu-red interactive-hover"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </span>
                  )}
                </span>
              </div>
              <div>
                Please copy and paste the code to a safe place,{' '}
                <strong>
                  you wil not be able to see it again after leaving this page.
                </strong>
              </div>
              {this.state.seed ? null : (
                <Fragment>
                  <div
                    onClick={() => {
                      this.setState({
                        showCompensationExplanation: true,
                      })
                    }}
                    className="link"
                  >
                    What am I supposed to do with the code?
                  </div>
                  {this.state.showCompensationExplanation ? (
                    <Popup
                      onClose={() =>
                        this.setState({ showCompensationExplanation: false })
                      }
                    >
                      <div>
                        In order to receive your compensation, please fill in the confirmation code on the Microworker's campaign.
                      </div>
                    </Popup>
                  ) : null}
                </Fragment>
              )}
            </Fragment>
          ) : null}
          <p>
            {allowAnotherSession ? (
              <Fragment>
                You can now close this window.
              </Fragment>
            ) : (
              'You can now close this window.'
            )}{' '}
            We would also appreciate some <a href="/feedback">feedback</a> on
            the study, so that we can improve it in the future.
          </p>
        </Fragment>
      )
    }

    return null
  }

  render() {
    const { previousSession } = this.state
    const previouslyTraining = previousSession === 'Training'
    const previouslyFeedback = previousSession === 'Feedback'
    const previouslyRating =
      previousSession && !previouslyTraining && !previouslyFeedback
    const allowAnotherSession = !this.state.previousSession

    return (
      <div className="tu-border tu-glow center-box centered-content">
        {allowAnotherSession ? (
        <h2>Start {previouslyRating ? 'another' : 'a'} survey</h2>
        ): (<h2>Survey completed</h2>)
        }
        {this.renderThankYou()}
        {allowAnotherSession ? (
          <Fragment>
            {this.state.hasActiveSession ? (
              <div>
                You have unsaved ratings. You can continue where you left off
                and complete your survey, or start a new one and delete the
                unsaved changes.
              </div>
            ) : null}
            <div className="start-session">
              {this.state.hasActiveSession ? (
                <Link className="btn" to="/session">
                  Continue Survey
                </Link>
              ) : null}
              {this.state.completedTrainingSession ? (

                <Link
                  className="btn"
                  to="/session"
                  onClick={e => {
                    if (this.state.tooManyConsecutiveSessions) {
                      e.preventDefault()
                      this.setState({ showBreakPopup: true })
                    } else {
                      this.deleteActiveSession()
                      if (!this.isPartOfChain()) {
                        chainStartStore.set(new Date())
                        chainAmountStore.set(1)
                      } else {
                        chainAmountStore.set(chainAmountStore.get() + 1)
                      }
                    }
                  }}
                >
                  Start
                  {this.state.hasActiveSession
                    ? ' new'
                    : previouslyRating
                    ? ' another'
                    : ''}{' '}
                  Survey
                </Link>
              ) : null}
              {previouslyRating || previouslyTraining ? null : (
                <Link
                  className="btn"
                  to="/session"
                  onClick={() => {
                    this.deleteActiveSession()
                    this.props.onStartTraining()
                  }}
                >
                  Start Test Survey
                </Link>
              )}
            </div>
            {previouslyRating || previouslyTraining ? null : (
              <div className="centered-content">
                <div
                  className="link"
                  onClick={() => {
                    this.setState({
                      showTrainingExplanation: true,
                    })
                  }}
                >
                  What is a Test Survey?
                </div>
                <br />
                {this.state.showTrainingExplanation ? (
                  <Popup
                    onClose={() =>
                      this.setState({ showTrainingExplanation: false })
                    }
                  >
                    The answers of the test survey will not be recorded and you will get a pre-defined set
                    of one very simple, one average, and one very difficult
                    text. This can help you familiarize yourself with the
                    process of the study and give you a feeling of the different
                    levels of texts.
                  </Popup>
                ) : null}
              </div>
            )}
            {this.state.tooManyConsecutiveSessions ? (
              <Timer initialTime={5 * 60 * 1000} direction="backward">
                {timerControl => {
                  if (timerControl.getTime() <= 0) {
                    this.setState({ tooManyConsecutiveSessions: false })
                    chainAmountStore.clear()
                    chainStartStore.clear()
                  }
                  return this.state.showBreakPopup ? (
                    <Popup
                      onClose={() => this.setState({ showBreakPopup: false })}
                    >
                      <div>
                        You have done a lot of work already, thank you! Please
                        take a little break before you continue, so that you can
                        stay focused and concentrated.
                      </div>
                      <div className="break-timer">
                        {timerControl.getTime() > 60 * 1000 ? (
                          <Fragment>
                            <Timer.Minutes /> minutes
                          </Fragment>
                        ) : null}{' '}
                        <Timer.Seconds /> seconds
                      </div>
                    </Popup>
                  ) : null
                }}
              </Timer>
            ) : null}
          </Fragment>
        ) : null}
      </div>
    )
  }
}

StartSession.propTypes = {
  pouchParticipants: databasePropType,
  onStartTraining: PropTypes.func,
}

export default StartSession

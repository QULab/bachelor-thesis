import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import '../styles/Demographics.css'
import createStore from '../lib/create-store'

const defaultState = {
  age: '',
  nativeLang: '',
  gender: '',
  genderText: '',
  gerLevel: '',
}

const demographicStore = createStore('demographic', {
  deleteAfterSession: true,
})

class Demographics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: { ...defaultState },
    }
  }

  renderQuestion(label, key, type, options = []) {
    return (
      <div className="centered-content">
        <label htmlFor={key} className="block question-label">
          <strong>{label}</strong>
        </label>
        {type === 'dropdown' ? (
          <select
            onChange={e => {
              this.setState({
                data: { ...this.state.data, [key]: e.target.value },
              })
            }}
            value={this.state.data[key]}
            required
          >
            <option value={''} disabled>
              Please Select
            </option>
            {options.map(option => {
              return (
                <option value={option.value || option} key={option}>
                  {option.label || option}
                </option>
              )
            })}
          </select>
        ) : (
          <input
            onChange={e => {
              this.setState({
                data: { ...this.state.data, [key]: e.target.value },
              })
            }}
            id={key}
            name={key}
            type={type}
            value={this.state.data[key]}
          />
        )}
      </div>
    )
  }

  render() {
    return (
      <div className="tu-border tu-glow center-box centered-content">
        <h3>Demographic Questions</h3>
        <div>Please fill out the questions below for statistical reasons:</div>
        <form
          onSubmit={e => {
            e.preventDefault()
          }}
          className="centered-content demographics-form"
        >
          {this.renderQuestion('Age: ', 'age', 'dropdown', [
            '18-26',
            '27-32',
            '33-40',
            '41-55',
            '56+',
            { label: 'Prefer not to say', value: 'notDisclosed' },
          ])}
          <strong>Gender(s)*:</strong>
          <div>
            {[
              { key: 'female', label: 'Female' },
              { key: 'male', label: 'Male' },
              { key: 'nonbinary', label: 'Nonbinary' },
              { key: 'text' },
              { key: 'notDisclosed', label: 'Prefer not to answer' },
            ].map(({ key, label }) => (
              <div key={`gender-${key}`}>
                <input
                  type="radio"
                  name="gender"
                  id={`gender-${key}`}
                  value={key}
				  required
                  checked={this.state.data.gender === key}
                  onChange={() =>
                    this.setState({ data: { ...this.state.data, gender: key } })
                  }
                />
                {key === 'text' ? (
                  <Fragment>
                    <label htmlFor="gender-other" className="screenreader-only">
                      Other (please write your answer in the text field)
                    </label>
                    <input
                      type="text"
                      name="gender-text"
                      id="gender-text"
                      value={this.state.data.genderText}
					  required
                      onChange={e =>
                        this.setState({
                          data: {
                            ...this.state.data,
                            gender: 'text',
                            genderText: e.target.value,
                          },
                        })
                      }
                    />
                  </Fragment>
                ) : (
                  <label htmlFor={`gender-${key}`}>{label}</label>
                )}
              </div>
            ))}
          </div>
          {this.renderQuestion('Native Language(s)*: ', 'nativeLang', 'text')}
          {this.renderQuestion(
            'German Language Level: ',
            'gerLevel',
            'dropdown',
            [
              'A1',
              'A2',
              'B1',
              'B2',
              'C1',
              'C2',
              'Native',
              { label: "I don't know", value: 'notDisclosed' },
            ]
          )}

          <Link
            className="btn"
            to="/start-session"
            onClick={() => {
              demographicStore.set(this.state.data)
            }}
          >
            Continue
          </Link>
          <br />
          <div className="note">*separate multiple entries by commas</div>
        </form>
      </div>
    )
  }
}

Demographics.propTypes = {
  createUser: PropTypes.func,
}

export default Demographics

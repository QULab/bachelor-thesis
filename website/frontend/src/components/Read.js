import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Timer from 'react-compound-timer'
import '../styles/Read.css'
import { itemPropType } from '../lib/prop-types'

const spaceKeyCode = 32

const ShowItemTrigger = ({ children, revealItem, hideItem }) => {
  return (
    <div
      onTouchStart={revealItem}
      onTouchEnd={hideItem}
      onMouseDown={revealItem}
      onMouseUp={hideItem}
      onMouseLeave={hideItem}
      onKeyDown={e => {
        if (e.keyCode === spaceKeyCode) {
          revealItem()
        }
      }}
      onKeyUp={e => {
        if (e.keyCode === spaceKeyCode) {
          hideItem()
        }
      }}
    >
      {children}
    </div>
  )
}

class Read extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showItem: false }

    if (props.item.type === 'paragraph' && !props.preventNext) {
      props.onPreventNext(
        'Please hold "Show Paragraph" and read the text carefully.'
      )
    }
  }

  revealItem(timerControl) {
    timerControl.start()
    this.setState({ showItem: true })
  }

  hideItem(timerControl) {
    timerControl.pause()
    this.setState({ showItem: false })
    this.props.onTimeUpdate(timerControl.getTime())
  }

  renderParagraph({ text }) {
    return (
      <Timer startImmediately={false} timeToUpdate={100}>
        {timerControl => (
          <Fragment>
            <div className="note">
              (Click and hold the paragraph or the button "Show Paragraph" to
              reveal the text)
            </div>
            <ShowItemTrigger
              timerControl={timerControl}
              revealItem={() => this.revealItem(timerControl)}
              hideItem={() => this.hideItem(timerControl)}
            >
              <p className={`item-text centered-content`}>
                <span>
                  <span className={`${this.state.showItem ? '' : 'hidden'}`}>
                    <span className="hidden-content">{text}</span>
                  </span>
                </span>
                <button className="btn">Show Paragraph</button>
              </p>
            </ShowItemTrigger>
          </Fragment>
        )}
      </Timer>
    )
  }

  renderSentence({ text, enclosingParagraph }) {
    const splitText = enclosingParagraph.split(text)
    return (
      <Fragment>
        <div className="item-text centered-content">{text}</div>
        <div className="enclosing-paragraph">
          If you need more context, here is the paragraph the sentence was taken
          from: <br />
          (You don't have to read this, but it can help you understand the
          sentence above.)
          <div className="item-text">
            {splitText[0]}
            <strong>{text}</strong>
            {splitText[1]}
          </div>
        </div>
      </Fragment>
    )
  }

  render() {
    const { item } = this.props
    const isSentence = item.type === 'sentence'

    return (
      <Fragment>
        <div>
          Please read this {item.type} carefully and make sure you understand it
          as well as you can. You can not come back to read it again once you
          click on "Next Step".
        </div>
        {isSentence ? this.renderSentence(item) : this.renderParagraph(item)}
      </Fragment>
    )
  }
}

Read.propTypes = {
  onTimeUpdate: PropTypes.func,
  item: itemPropType,
  onPreventNext: PropTypes.func,
  onAllowNext: PropTypes.func,
  preventNext: PropTypes.bool,
}

export default Read

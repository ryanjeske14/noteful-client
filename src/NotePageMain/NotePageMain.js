import React from "react";
import Note from "../Note/Note";
import "./NotePageMain.css";
import AppContext from "../AppContext";
import { findNote } from "../notes-helpers";
import ErrorBoundary from "../ErrorBoundary";

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  };

  static contextType = AppContext;

  handleDeleteNote = noteId => {
    this.props.history.push(`/`);
  };

  render() {
    const { notes = [] } = this.context;
    const { noteId } = this.props.match.params;
    const note = findNote(notes, noteId) || { content: "" };
    return (
      <ErrorBoundary>
        <section className="NotePageMain">
          <Note
            id={note.id}
            name={note.name}
            modified={note.modified}
            onDeleteNote={this.handleDeleteNote}
          />
          <div className="NotePageMain__content">
            {note.content.split(/\n \r|\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      </ErrorBoundary>
    );
  }
}

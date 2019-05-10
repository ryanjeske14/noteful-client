import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import "./AddNote.css";
import AppContext from "../AppContext";
import ValidationError from "../AddFolder/ValidationError";
import config from "../config";

export default class AddNote extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      noteName: "",
      content: "",
      folder: null,
      noteNameValid: false,
      contentValid: false,
      folderValid: false,
      formValid: false,
      validationMessages: {
        noteName: "",
        content: "",
        folder: ""
      }
    };
  }

  static defaultProps = {
    folders: []
  };

  updateNoteName(noteName) {
    this.setState({ noteName }, () => this.validateNoteName(noteName));
  }

  updateContent(content) {
    this.setState({ content }, () => {
      this.validateContent(content);
    });
  }

  updateFolder(folder) {
    this.setState({ folder }, () => this.validateFolder(folder));
  }

  validateNoteName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.noteName = "Note Name is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.noteName = "Note Name must be at lest 3 characters long";
        hasError = true;
      } else {
        fieldErrors.noteName = "";
        hasError = false;
      }
    }
    this.setState(
      {
        validationMessages: fieldErrors,
        noteNameValid: !hasError
      },
      this.formValid
    );
  }

  validateContent(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.content = "Content is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.content = "Content must be at lest 3 characters long";
        hasError = true;
      } else {
        fieldErrors.content = "";
        hasError = false;
      }
    }
    this.setState(
      {
        validationMessages: fieldErrors,
        contentValid: !hasError
      },
      this.formValid
    );
  }

  validateFolder(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;

    if (fieldValue === "...") {
      fieldErrors.folder = "Please select a folder";
      hasError = true;
    } else {
      fieldErrors.folder = "";
      hasError = false;
    }
    this.setState(
      {
        validationMessages: fieldErrors,
        folderValid: !hasError
      },
      this.formValid
    );
  }

  formValid() {
    this.setState({
      formValid:
        this.state.noteNameValid &&
        this.state.contentValid &&
        this.state.folderValid
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      "note-name-input": noteName,
      "note-content-input": content,
      "note-folder-select": folder
    } = event.target;
    const note = {
      name: noteName.value,
      modified: new Date(),
      folder_id: Number(folder.value),
      content: content.value
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(resJson => {
        this.context.addNote(resJson);
        this.props.history.push(`/`);
      })
      .catch(error => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="note-name-input">Name</label>
            <input
              type="text"
              id="note-name-input"
              onChange={e => this.updateNoteName(e.target.value)}
            />
            <ValidationError
              hasError={!this.state.noteNameValid}
              message={this.state.validationMessages.noteName}
            />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              onChange={e => this.updateContent(e.target.value)}
            />
            <ValidationError
              hasError={!this.state.contentValid}
              message={this.state.validationMessages.content}
            />
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select
              id="note-folder-select"
              onChange={e => this.updateFolder(e.target.value)}
            >
              <option value={null}>...</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <ValidationError
              hasError={!this.state.folderValid}
              message={this.state.validationMessages.folder}
            />
          </div>
          <div className="buttons">
            <button type="submit" disabled={!this.state.formValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

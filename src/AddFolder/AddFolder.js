import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import "./AddFolder.css";
import ValidationError from "./ValidationError";
import config from "../config";
import AppContext from "../AppContext";

export default class AddFolder extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      folderName: "",
      folderNameValid: false,
      formValid: false,
      validationMessages: {
        folderName: ""
      }
    };
  }

  updateFolderName(folderName) {
    this.setState({ folderName }, () => {
      this.validateFolderName(folderName);
    });
  }

  validateFolderName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.folderName = "Folder Name is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.folderName =
          "Folder Name must be at lest 3 characters long";
        hasError = true;
      } else {
        fieldErrors.folderName = "";
        hasError = false;
      }
    }

    this.setState(
      {
        validationMessages: fieldErrors,
        folderNameValid: !hasError
      },
      this.formValid
    );
  }

  formValid() {
    this.setState({
      formValid: this.state.folderNameValid
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(event.target["folder-name-input"].value);
    const folderName = event.target["folder-name-input"].value;
    const folder = {
      name: folderName
    };

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      body: JSON.stringify(folder),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(resJson => {
        this.context.addFolder(resJson);
        this.props.history.push(`/`);
      })
      .catch(error => {
        console.error({ error });
      });
  };

  render() {
    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">Name</label>
            <input
              type="text"
              id="folder-name-input"
              onChange={e => this.updateFolderName(e.target.value)}
            />
            <ValidationError
              hasError={!this.state.folderNameValid}
              message={this.state.validationMessages.folderName}
            />
          </div>
          <div className="buttons">
            <button type="submit" disabled={!this.state.formValid}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

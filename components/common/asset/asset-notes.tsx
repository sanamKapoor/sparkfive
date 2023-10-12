import { useState } from "react";
import { Utilities } from "../../../assets";
import assetApi from "../../../server-api/asset";
import toastUtils from "../../../utils/toast";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import TextArea from "../inputs/text-area";
import AssetNoteItem from "./asset-note-item";
import styles from "./asset-notes.module.css";

import { maximumNoteLength } from "../../../constants/notes";

const note_long_error = `Text longer than ${maximumNoteLength} letters.`;

const AssetNotes = ({ asset, notes, applyCrud }) => {
  const [internal, setInternal] = useState(true);
  const [noteText, setNoteText] = useState("");

  const createNote = async () => {
    try {
      if (!noteText) {
        return;
      }
      const { data } = await assetApi.saveNote({
        assetId: asset.id,
        text: noteText,
        internal,
      });
      if (data.text_too_long) {
        toastUtils.error(note_long_error);
      } else {
        applyCrud("add", data);
        setNoteText("");
        return true;
      }
    } catch (err) {
      // console.log(err)
    }
  };

  const saveChanges = async (note, newText) => {
    try {
      const { data } = await assetApi.saveNote({ ...note, text: newText });
      if (data.text_too_long) {
        toastUtils.error(note_long_error);
      } else {
        note.text = newText;
        applyCrud("edit", note);
        return true;
      }
    } catch (err) {
      // console.log(err)
    }
  };

  const deleteNote = async (note) => {
    try {
      const { data } = await assetApi.deleteNote(note.id);
      if (data.deleted) {
        applyCrud("delete", note);
      }
    } catch (err) {
      // console.log(err)
    }
  };
  const updateText = (e) => {
    const text = e.target.value;
    setNoteText(text);
  };

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h2>Notes</h2>
        <h3>{notes.length} Note(s)</h3>
      </div>
      {notes.length < 2 && (
        <span>
          <TextArea
            placeholder="Add a note"
            rows={7}
            className={styles.input}
            value={noteText}
            onChange={updateText}
            maxlength={maximumNoteLength}
          />
          <div className={styles.radios}>
            <div className={styles["radio-wrapper"]}>
              <IconClickable
                src={
                  internal
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                onClick={() => setInternal(true)}
              />
              <div className={"font-12 m-l-10"}>For internal use only</div>
            </div>
            <div className={styles["radio-wrapper"]}>
              <IconClickable
                src={
                  !internal
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                onClick={() => setInternal(false)}
              />
              <div className={"font-12 m-l-10"}>
                Display internally and externally
              </div>
            </div>
          </div>
          <Button
            text={"Save"}
            type={"button"}
            className={"container primary"}
            disabled={!noteText}
            onClick={createNote}
          />
        </span>
      )}
      <div className={styles.divider}></div>
      {notes &&
        notes.length > 0 &&
        notes.map((note, indx) => (
          <AssetNoteItem
            title={`Note ${indx + 1}`}
            note={note}
            key={indx.toString()}
            saveChanges={saveChanges}
            deleteNote={deleteNote}
          />
        ))}
    </div>
  );
};

export default AssetNotes;

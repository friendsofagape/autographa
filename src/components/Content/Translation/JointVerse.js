import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AutographaStore from "../../AutographaStore";
const db = require(`${__dirname}/../../../core/data-provider`).targetDb();

const JointVerse = (props) => {
  const addJoint = () => {
    let verseNumber = props.index + 1;
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let verses =
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
      let jointVerse;
      // Preceeding verse is joint verse then check for preceeding verse without joint
      if (verses[verseNumber - 2].joint_verse) {
        jointVerse = verses[verseNumber - 2].joint_verse;
      } else {
        jointVerse = verseNumber - 1;
      }
      // Add joint by adding the content to preceeding verse
      doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses[
        jointVerse - 1
      ] = {
        verse_number: jointVerse,
        verse:
          verses[jointVerse - 1].verse + " " + verses[verseNumber - 1].verse,
      };
      doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses[
        verseNumber - 1
      ] = {
        verse_number: verseNumber,
        verse: "",
        joint_verse: jointVerse,
      };
      // Change the "joint_verse" number to current verse for next verse, if they are join verses
      for (
        let i = 0;
        verses.length > verseNumber + i &&
        verses[verseNumber + i].joint_verse === verseNumber;
        i++
      ) {
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses[
          verseNumber + i
        ] = {
          verse_number: verseNumber + 1 + i,
          verse: "",
          joint_verse: jointVerse,
        };
      }
      db.put(doc, function (err, response) {
        if (err) {
          return console.log(err);
        } else {
          window.location.reload();
        }
      });
    });
  };

  const removeJoint = () => {
    let verseNumber = props.index + 1;
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let verses =
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
      doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses[
        verseNumber - 1
      ] = {
        verse_number: verseNumber,
        verse: "",
      };
      for (
        let i = 0;
        verses.length > verseNumber + i && verses[verseNumber + i].joint_verse;
        i++
      ) {
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses[
          verseNumber + i
        ] = {
          verse_number: verseNumber + 1 + i,
          verse: "",
          joint_verse: verseNumber,
        };
      }
      db.put(doc, function (err, response) {
        if (err) {
          return console.log(err);
        } else {
          window.location.reload();
        }
      });
    });
  };
  return (
    <div>
      <Menu
        id="simple-menu"
        keepMounted
        open={props.show.mouseY !== null}
        onClose={props.close}
        anchorReference="anchorPosition"
        anchorPosition={
          props.show.mouseY !== null && props.show.mouseX !== null
            ? { top: props.show.mouseY, left: props.show.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={addJoint}
          disabled={AutographaStore.jointVerse[props.index] !== undefined}
        >
          Join to the preceding verse
        </MenuItem>
        <MenuItem
          onClick={removeJoint}
          disabled={AutographaStore.jointVerse[props.index] === undefined}
        >
          Unjoin this verse
        </MenuItem>
      </Menu>
    </div>
  );
};
export default JointVerse;

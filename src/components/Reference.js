import React from "react";
import { observer } from "mobx-react";
import AutographaStore from "./AutographaStore";
import Download from "./Download";
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();

@observer
class Reference extends React.Component {
  constructor(props) {
    super(props);
    this.state = { verses: [], defaultRef: "eng_ult", refList: [] };
    let existRef = [];
    AutographaStore.refList = [];
    let refLists = refDb.get("refs").then((doc) => {
      doc.ref_ids.forEach((ref_doc) => {
        existRef.push({ value: ref_doc.ref_id, option: ref_doc.ref_name });
      });
      return existRef;
    });
    refLists.then((refsArray) => {
      AutographaStore.refList = refsArray;
    });
  }
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#f5f8fa",
          paddingTop: "26px",
          borderRight: "1px solid #d3e0e9",
        }}
      >
        <select
          className="ref-drop-down"
          title="Select Reference Text"
          onChange={this.props.onClick}
          value={this.props.refIds}
          id={this.props.id}
          data-layout={this.props.layout}
          disabled={`${AutographaStore.toggle ? "disabled" : ""}`}
        >
          {AutographaStore.refList.map(function (refDoc, index) {
            return (
              <option value={refDoc.value} key={index}>
                {refDoc.option}
              </option>
            );
          })}
        </select>
        <Download listNameFromParent={this.state.refList} />
      </div>
    );
  }
}
export default Reference;

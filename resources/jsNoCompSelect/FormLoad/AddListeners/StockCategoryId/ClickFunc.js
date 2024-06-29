import xmlsNeededJson from '../../../FromTally/xmlsNeeded.json' with {type: 'json'};
import ColumnsJson from './columns.json' with {type: 'json'};
const CommonParentTagName = "STOCKCATEGORIES";
const CommonTagName = "KSSTOCKCATEGORYNAME";

let jFLocalHideSpinner = () => {
    let jVarLocalSpinnerId = document.getElementById("SpinnerId");
    jVarLocalSpinnerId.style.display = "none";
};

let jFLocalShowSpinner = () => {
    let jVarLocalSpinnerId = document.getElementById("SpinnerId");
    jVarLocalSpinnerId.style.display = "";
};

let StartFunc = async () => {
    jFLocalShowSpinner();

    let jVarLocalXml = await jFLocalGetXml();

    let jVarLocalItemData = await FromTally({ inXml: jVarLocalXml });

    let jVarLocalItemsJson = jFLocalXmlToJson({ inXmlFromTally: jVarLocalItemData });

    var $table = $('#tableBS');

    $table.bootstrapTable("destroy").bootstrapTable({
        columns: ColumnsJson, data: jVarLocalItemsJson
    });

    jFLocalHideSpinner();
};

let FromTally = async ({ inXml }) => {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/xml',
            'Content-Type': 'text/xml',
        },
        body: inXml
    };

    let r2 = await fetch("http://localhost:9000/", config);
    let d2 = await r2.text();
    // console.log("jVarLocalData /; ", d2);
    return d2;
};

let jFLocalGetXml = async () => {
    let jVarLocalUrl = xmlsNeededJson.StockCategory;

    let jVarLocalResponse = await fetch(jVarLocalUrl);
    let jVarLocalData = await jVarLocalResponse.text();
    return jVarLocalData;

};

const jFLocalXmlToJson = ({ inXmlFromTally }) => {
    let jVarLocalItemsXml = inXmlFromTally;
    let ReturnArray = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(jVarLocalItemsXml.replaceAll("&#4;", ""), "application/xml");

    let checkboxes = doc.documentElement.querySelectorAll(CommonParentTagName);

    checkboxes.forEach((userItem) => {
        let LoopInsideObject = {};
        let LoopInsideName = userItem.querySelector(CommonTagName);

        if (LoopInsideName === null === false) {
            LoopInsideObject.StockCategory = LoopInsideName.innerHTML;
        };

        ReturnArray.push(LoopInsideObject);
    });

    return ReturnArray;
};

export { StartFunc };
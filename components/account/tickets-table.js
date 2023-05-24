import React, { useEffect, useState } from "react";
import { formatDate } from "../../helpers/dateformat";
import { selected_row_load } from "../../helpers/pickio";
import FsLightbox from "fslightbox-react";
import TicketLine from "../ticket/line";
import { generateArray } from "../../helpers/array";

const TicketsTable = ({ headers, values, style, groupLines }) => {
  const [shows, setShows] = React.useState([]);
  const [toggler, setToggler] = useState(false);
  const tens = generateArray(0, 9);
  const fours = generateArray(0, 4);
  useEffect(() => {
    setShows(values.map(() => false));
  }, [values]);
  const selectedRow = React.useCallback((numbers) => {
    const rows = selected_row_load(numbers);
    return (
      <ul style={{ display: "flex", justifyContent: "center" }}>
        {rows[0].map((num, idx) => (
          <li key={idx} className="result_ellipse_blue">
            {num}
          </li>
        ))}
        {rows[1].map((num, idx) => (
          <li key={`green-${idx}`} className="result_ellipse_green">
            {num}
          </li>
        ))}
      </ul>
    );
  }, []);

  const selectedNumbers = React.useCallback((sels) => {
    return (
      <div>
        {sels &&
          Object.values(sels).map((numbers, index) => (
            <React.Fragment key={index}>{selectedRow(numbers)}</React.Fragment>
          ))}
      </div>
    );
  }, []);

  const toggleShow = React.useCallback((idx) => {
    shows[idx] = !shows[idx];
    setShows([...shows]);
  }, []);
  return (
    <div className="w-100" className="tickets-table">
      <table cellSpacing="1" cellPadding="0" style={style}>
        <thead className="btn_dark-blue">
          <tr>
            {headers.map((item, index) => (
              <th height="30" align="center" valign="middle" key={index}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      {values.map((value, index) => (
        <div className="collapsable-table-row" key={`th-${index}`}>
          <table className="header" onClick={() => toggleShow(index)}>
            <tbody>
              <tr>
                <td align="center" valign="middle" className="center">
                  <span>
                    <img
                      src={`/images/flag_${value.CountryName.toLowerCase()}.png`}
                    />
                  </span>
                  &nbsp;{value.CountryName}
                </td>
                <td align="center" valign="middle" style={{ color: "#00C38A" }}>
                  {value.LotteryName}
                </td>
                <td align="center" valign="middle">
                  {value.SingleLines?.SelectedNumbers ? "Personal" : "Group"}
                </td>
                <td align="center" valign="middle">
                  {formatDate(new Date(value.DrawDate))}
                </td>
                <td align="center" valign="middle">
                  {value.WinningResult
                    ? value.Winning === 0
                      ? "No Win"
                      : "Win"
                    : "Yet to Draw"}
                </td>
                <td align="center" valign="middle">
                  {value.Winning}
                </td>
                <td align="center" valign="middle">
                  <div className="drawer-header-icon"></div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className={shows[index] ? "contents" : "hidden"}>
            <table>
              <thead>
                <tr>
                  <th>Personal</th>
                  <th>Selected Numbers</th>
                  <th>Draw Results</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td align="center" valign="middle">
                    {!!value.ScanImageUrls.length && (
                      <>
                        <img
                          src="/images/ticket_scan.png"
                          onClick={() => setToggler((prev) => !prev)}
                        />
                        <FsLightbox
                          toggler={toggler}
                          type="image"
                          sources={value.ScanImageUrls}
                        />
                      </>
                    )}
                  </td>
                  <td className="selected-numbers">
                    {selectedNumbers(value.SingleLines?.SelectedNumbers)}
                  </td>
                  <td className="selected-numbers">
                    {value.WinningResult
                      ? selectedRow(value.WinningResult + value.BonusNumber)
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
            {!value.SingleLines && (
              <section className="active group-lines">
                <div className="lines-box">
                  {fours.map((col) => (
                    <div className="ten-lines-box" key={col}>
                      {tens.map((row) => (
                        <TicketLine
                          numbers={
                            groupLines[value.LotteryName.toLowerCase()][
                              col * 10 + row
                            ]
                          }
                          key={col * 10 + row}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketsTable;

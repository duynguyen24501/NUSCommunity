import React from "react";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import { Table } from "antd";
import "./index.css";

export default class Leaderboard extends React.Component {
  render() {
    const dataSource = [
      {
        key: "id1",
        name: "John Doe",
        num: 32,
        msg: "西湖区湖底公园1号",
      },
      {
        key: "id2",
        name: "Harry White",
        num: 42,
        msg: "西湖区湖底公园12号",
      },
      {
        key: "id3",
        name: "Mary Johnson",
        num: 52,
        msg: "西湖区湖底公园3号",
      },
    ];

    const columns = [
      {
        title: "#",
        dataIndex: "key",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Username",
        dataIndex: "name",
      },
      {
        title: "Achievement",
        dataIndex: "msg",
      },
      {
        title: "Contribution Points",
        dataIndex: "num",
      },
    ];
    return (
      <div className="leaderboard">
        <div className="leaderboard-bar">
          <h1>
            <EmojiObjectsIcon />
            Leaderboard
          </h1>
        </div>
        <Table
          title={() => <h4>Ranking</h4>}
          className="leaderboard-table"
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
        />
      </div>
    );
  }
}

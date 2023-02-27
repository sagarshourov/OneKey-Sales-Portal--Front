const FollowUp = (props) => {
  const { data, theme, title, handelGo } = props;

  return (
    <div className="overflow-x-auto mt-5">
      <table className="table box">
        <thead className={theme}>
          <tr>
            <th className="whitespace-nowrap"> {title} </th>
            <th>Sections</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((val, index) => (
            <tr
              key={index}
              onClick={() => handelGo(val.sections)}
              className="cursor-pointer"
            >
              <td>{val?.email}</td>
              <td>{val?.section?.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FollowUp;

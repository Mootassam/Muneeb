export default (app) => {
  app.get(
    `/tenant/:tenantId/team`,
    require("./teamFind").default
  );
  app.get(
    `/tenant/:tenantId/team/:userId`,
    require("./teamFind").default
  );
};

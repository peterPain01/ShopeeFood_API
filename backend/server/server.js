const app = require("../app");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

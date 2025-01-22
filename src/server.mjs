import 'dotenv/config';
import server from './app.mjs';

const PORT = process.env.PORT || 3000;
console.log(PORT);
// This is neccessary for starting the server
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

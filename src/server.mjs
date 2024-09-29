import 'dotenv/config';
import server from './app.mjs';

const PORT = process.env.PORT || 3000;
console.log(PORT);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);

});

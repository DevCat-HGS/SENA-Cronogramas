const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logDirectory = path.join(__dirname, '../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Crear stream de escritura para logs
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);

// Formato personalizado para morgan
const morganFormat = process.env.NODE_ENV === 'development' 
  ? 'dev' 
  : ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Configuración de morgan para desarrollo
const morganDev = morgan(morganFormat);

// Configuración de morgan para producción
const morganProd = morgan(morganFormat, {
  stream: accessLogStream
});

module.exports = {
  morganDev,
  morganProd
};
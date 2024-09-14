const { body, validationResult } = require("express-validator");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = 8000;
app.use(express.json());
app.use(cors());
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..','frontend')));

//conexion a la base de datos.
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "db",
    port: 5432,
    user: "alejo",
    password: "1234",
    database: "desarrolloweb",
  },
});

// app.post('/submit', async (req, res) => {
//   const data = req.body; // Recibe los datos enviados por fetch
//   console.log('Datos recibidos:', data);
//   try {
//     const {nombre, apellido, email, password, gender, pais, terminos} = req.body;
//     const result = await knex.raw(
//       `INSERT INTO usuarios(nombre, apellido, email, password, genero, pais, terminos) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING*`,
//       [nombre, apellido, email, password, gender, pais, terminos]
//     );

//     res.status(200).json({ message: 'Datos insertados correctamente', result });
//   } catch (err) {
//     console.error('Error al insertar los datos:',err);
//     if (!res.headersSent) {
//       res.status(500).json({error: 'Error al guardar los datos en la base de datos'});
//     }
//   }
// });

//enviar datos a la base de datos.

//validaciones en el backend

// Ruta para recibir los datos del formulario y realizar las validaciones

app.post("/submit",
  [
    // Validación de campos requeridos
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio"),

    // Validación del formato del correo electrónico
    body("email").isEmail().withMessage("Debe proporcionar un correo electrónico válido"),

    // Validación de longitud mínima de la contraseña
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),

    // Validación del género (campo obligatorio)
    body("gender").notEmpty().withMessage("El género es obligatorio"),

    // Validación del país (puedes agregar más lógica si es necesario)
    body("pais").notEmpty().withMessage("El país es obligatorio"),

    // Validación de términos (el usuario debe aceptar los términos y condiciones)
    body("terminos").custom(value => {
       if(!value){
         throw new Error('Debe aceptar los terminos y condiciones')
       }
       return true;
    })
  ],
  async (req, res) => {
    // Manejar el resultado de las validaciones
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    // Si no hay errores, continúa con el procesamiento de los datos
    // Validar la información recibida
    const data = req.body;
    console.log("Datos recibidos", data);

    // Guardar datos en una base de datos
    try {
      const { nombre, apellido, email, password, gender, pais, terminos } = req.body;
      const result = await knex("usuarios")
        .insert({
          nombre: nombre,
          apellido: apellido,
          email: email,
          password: password,
          genero: gender,
          pais: pais,
          terminos: terminos,
        })
        .returning("*");
      console.log("Info stored successfully");

      return res.status(200).json({ message: "Datos insertados correctamente", result });
    } catch (err) {
      console.error("Error al insertar datos", err);

      if (!res.headersSent) {
        return res
          .status(500)
          .json({ msg: 'Internal Server Error. Please contact "al inge"' });
      }
    }
    res.status(200).json({ message: "Datos validados y procesados correctamente" });
  }
);

// app.post("/submit", async (req, res) => {
//   // Validar la información recibida
//   const data = req.body;
//   console.log("Datos recibidos", data);

//   // Guardar datos en una base de datos
//   try {
//     const { nombre, apellido, email, password, gender, pais, terminos } =
//       req.body;
//     const result = await knex("usuarios")
//       .insert({
//         nombre: nombre,
//         apellido: apellido,
//         email: email,
//         password: password,
//         genero: gender,
//         pais: pais,
//         terminos: terminos,
//       })
//       .returning("*");
//     console.log("Info stored successfully");

//     return res
//       .status(200)
//       .json({ message: "Datos insertados correctamente", result });
//   } catch (err) {
//     console.error("Error al insertar datos", err);

//     if (!res.headersSent) {
//       return res
//         .status(500)
//         .json({ msg: 'Internal Server Error. Please contact "al inge"' });
//     }
//   }
// });

app.get("/registros", async (req, res) => {
  try {
    // traer los registros desde la base de datos:
    const registros = await knex("usuarios").select("*");
    res.status(200).json(registros);
  } catch (err) {
    console.error("Error al obtener los registros", err);
    res
      .status(500)
      .json({ message: 'Error en el servidor' });
  }
});

const crearTablas = async () => {
  console.log("Intentando verificar si la tabla 'usuarios' existe...");

  try {
    // Verifica si la tabla 'usuarios' ya existe
    const existe = await knex.schema.hasTable('usuarios');
    console.log("¿La tabla existe?:", existe);
  
    if (!existe) {
      console.log('Creando tabla "usuarios" en la base de datos');
    
      // Crea la tabla 'usuarios'
      await knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('nombre').notNullable();
        table.string('apellido').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('genero').notNullable();
        table.string('pais').notNullable();
        table.boolean('terminos').notNullable();
      });

      console.log('Tabla "usuarios" creada exitosamente');
    } else {
      console.log('La tabla "usuarios" ya existe');
    }
  } catch (err) {
    console.error('Error al crear la tabla:', err); // Captura cualquier error durante la creación
  }
};

// Llama a la función `crearTablas` cuando el servidor se inicie
app.listen(port, async () => {
  console.log('Servidor iniciando...');
  await crearTablas();
  console.log(`Servidor activo en el puerto ${port}`);
});

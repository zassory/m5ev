const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const uuid = require('uuid');

const { request , response } = require("express");

const { guardar } = require("./functions/guardar");

const app = express();
const PORT = 3000
const baseUrl = 'http://localhost:3000/';

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 1 * 1024 * 1024 }
}));

app.post('/cargalibro', async(req = request, res = response) => {    

    if(!req.files || Object.keys(req.files).length === 0){
        res.send({
            status: false,
            message: "Debe ingresar la portada del libro",
            error: 400
        });
    } else{
        let fileRecived = req.files.fileName;
        let extName = fileRecived.name;
        uploadPath = `./files/${extName}`;

        if(fileRecived.mimetype === "image/png" || fileRecived.mimetype === "image/jpg"){
            fileRecived.mv(uploadPath, err => {
                if(err){
                    return res.status(500).send({
                        message: err
                    });
                }
                return res.status(200).send({
                    message: "Archivo subido correctamente"
                });
            });
        }else{
            return res.status(400).send({
                message: 'Archivo no valido, solo se aceptan extensiones png y jpg'
            });
        }
        
    }
});

app.get('/listadoarchivos', async(req = request, res = response) => {
    const directoryPath = "./files/";
    fs.readdir(directoryPath, function(err, files){
        if(err){
            res.status(500).send({
                message: "No se pued buscar archivos en el directorio"
            })
        }
        let listFiles = [];
        files.forEach((file) => {
            listFiles.push({
                name: file,
                url: baseUrl + file
            });
        });
        res.status(200).send(listFiles);
    })
});

app.delete("/files/:name", async(req = request, res = response) => {
    const fileName = req.params.name;
    const directoryPath = "./files/";
    let listFiles = [];

    try{
        fs.readdir(directoryPath, function(err, files){
            if(err){
                return res.status(500).send({
                    message: "No se puede buscar los archivos en el directorio",
                });
            }

            files.forEach((file) => {
                listFiles.push(file);
            });
            //Verificamos si el archivo se encuentra en el directorio
            let busqueda = listFiles.find(valor => valor === fileName);
            if(!busqueda){
                return res.status(409).json({
                    message: 'No se encontro el archivo a eliminar'
                });
            }else{
                fs.unlinkSync(directoryPath + fileName);
                res.status(200).send("Archivo eliminado satisfactoriamente");
            }
        })
    }catch(err){
        return res.status(500).json({
            message: `Ocurrio un error, hable con el administrador ${err}`
        })
    }
});

app.put("/files/:name", (req = request, res = response) => {
    //Primero saber si existe para actualizar
    const fileRecived = req.files.fileName;
    const fileName = req.params.name;
    let extName = fileName;
    const directoryPath = "./files/";
    let listFiles = [];
    uploadPath = `./files/${extName}`;

    try{
        fs.readdir(directoryPath, function(err, files){
            if(err){
                return res.status(500).send({
                    message: "No se puede buscar los archivos en el directorio",
                });
            }
            files.forEach((file) => {
                listFiles.push(file);
            });
            //Verificamos si el archivo se encuentra en el directorio
            let busqueda = listFiles.find(valor => valor === fileName);
            if(!busqueda){
                return res.status(409).json({
                    message: 'No se encontro el archivo para editar'
                });
            }else{
                if(fileRecived.mimetype === "image/png" || fileRecived.mimetype === "image/jpg"){
                     fileRecived.mv(uploadPath, err => {
                         if(err){
                             return res.status(500).send({
                                 message: err
                             });
                         }
                         res.status(200).send("Archivo actualizado satisfactoriamente");
                     });
                 }else{
                     return res.status(400).send({
                         message: 'Archivo no valido, solo se aceptan extensiones png y jpg'
                     });
                }
            }
        })
    }catch(err){
        console.log(`Error en actualizar ${err}`);
    }

    //Si existe listarlos todos hasta dar con el que quiero actualizar
    //Actualizar
})








app.listen(PORT, ()=> {
    console.log(`Conectado ok en el puerto: ${PORT}`);
})
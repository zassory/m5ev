const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
//const fileUpload = require("express-fileupload");

const guardar = (fileRecived,extName,uploadPath) => {                
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

module.exports = {
    guardar
}
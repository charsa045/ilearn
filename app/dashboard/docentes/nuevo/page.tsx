"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase-client";

import PublicHeader from "@/components/layout/header";

export default function NuevoDocentePage() {

  const router = useRouter();

  const [usuario, setUsuario] =
    useState<any>(null);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string>("");

  const [form, setForm] = useState({
    grado: "",
    area: "",
    titulo: "",
    correo: "",
    password: "",
    especialidad: "",
    institucion: "",
  });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) {

      router.push("/login");

      return;
    }

    fetch(`/api/usuarios?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {

        setUsuario(data);

        setForm((prev) => ({
          ...prev,
          correo: user.email || "",
        }));
      })
      .finally(() =>
        setLoadingUser(false)
      );

  }, [router]);

  if (loadingUser) {

    return (
      <p className="text-white text-center mt-10">
        Cargando...
      </p>
    );
  }

  const isAdmin =
    usuario?.rol === "admin";

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {

    const { name, value } = e.target;

    if (
      name === "grado" ||
      name === "area"
    ) {

      const newForm = {
        ...form,
        [name]: value,
      };

      if (
        newForm.grado &&
        newForm.area
      ) {

        newForm.titulo =
          `${newForm.grado} en ${newForm.area}`;
      }

      setForm(newForm);

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Debes seleccionar una imagen"
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "La imagen no debe superar los 5MB"
      );

      return;
    }

    setImageFile(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      if (!usuario) {

        throw new Error(
          "Usuario no cargado aún"
        );
      }

      let imageUrl = "";
      let imagePublicId = "";

      /**
       * 🔥 SOLO ADMIN SUBE FOTO
       */
      if (isAdmin) {

        if (!imageFile) {

          throw new Error(
            "Debes seleccionar una foto de perfil"
          );
        }

        const imageForm =
          new FormData();

        imageForm.append(
          "file",
          imageFile
        );

        const uploadRes =
          await fetch(
            "/api/imagenes",
            {
              method: "POST",
              body: imageForm,
            }
          );

        const uploadData =
          await uploadRes.json();

        if (!uploadRes.ok) {

          throw new Error(
            uploadData.message ||
              "Error subiendo imagen"
          );
        }

        imageUrl =
          uploadData.data.imageUrl;

        imagePublicId =
          uploadData.data.publicId;
      }

      /**
       * 🔥 BODY DINÁMICO
       */
      const body = isAdmin
        ? {
            email: form.correo,
            password:
              form.password,

            grado: form.grado,
            titulo: form.titulo,

            especialidad:
              form.especialidad,

            institucion:
              form.institucion,

            imageUrl,
            imagePublicId,
          }
        : {
            uid: usuario.uid,

            grado: form.grado,
            titulo: form.titulo,

            especialidad:
              form.especialidad,

            institucion:
              form.institucion,
          };

      const res =
        await fetch(
          "/api/docentes",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              body
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.error ||
            "Error al guardar docente"
        );
      }

      router.push("/dashboard");

    } catch (error: any) {

      console.error(error);

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        relative
        py-10
        px-4
      "
    >

      {/* 🔥 FONDO */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-blue-300
          via-blue-950
          to-emerald-800
          -z-10
        "
      />

      <form
        onSubmit={handleSubmit}
        className="
          relative
          z-10
          backdrop-blur-md
          bg-white/90
          p-8
          rounded-2xl
          shadow-xl
          space-y-4
          w-full
          max-w-md
        "
      >

        <h1 className="text-2xl font-bold text-center text-gray-800">

          {isAdmin
            ? "Registrar docente"
            : "Completa tu perfil"}

        </h1>

        {/* 🔥 FOTO SOLO ADMIN */}
        {isAdmin && (

          <div className="flex flex-col items-center gap-4">

            {/* 🔥 PREVIEW */}
            <div
              className="
                w-32
                h-32
                rounded-full
                overflow-hidden
                border-4
                border-blue-500
                shadow-md
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              {preview ? (

                <img
                  src={preview}
                  alt="Preview"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <span className="text-gray-400 text-sm text-center px-2">
                  Sin foto
                </span>
              )}
            </div>

            {/* 🔥 BOTÓN */}
            <label
              className="
                cursor-pointer
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5
                py-2
                rounded-lg
                font-semibold
                shadow
                transition
                text-center
              "
            >

              Seleccionar imagen

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={isAdmin}
                className="hidden"
              />
            </label>

            {/* 🔥 NOMBRE */}
            {imageFile && (

              <p
                className="
                  text-sm
                  text-green-700
                  text-center
                  break-all
                "
              >
                {imageFile.name}
              </p>
            )}
          </div>
        )}

        {/* 🔥 GRADO */}
        <select
          name="grado"
          value={form.grado}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        >

          <option value="">
            Grado
          </option>

          <option>
            Licenciatura
          </option>

          <option>
            Maestría
          </option>

          <option>
            Doctorado
          </option>
        </select>

        {/* 🔥 ÁREA */}
        <input
          name="area"
          placeholder="Área"
          value={form.area}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        />

        {/* 🔥 TÍTULO */}
        <input
          value={form.titulo}
          readOnly
          className="
            w-full
            border
            p-2
            rounded
            bg-gray-200
            text-blue-800
          "
        />

        {/* 🔥 SOLO ADMIN CREA USUARIO */}
        {isAdmin && (
          <>

            <input
              name="correo"
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="
                w-full
                border
                p-2
                rounded
                text-blue-800
              "
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="
                w-full
                border
                p-2
                rounded
                text-blue-800
              "
            />
          </>
        )}

        {/* 🔥 ESPECIALIDAD */}
        <input
          name="especialidad"
          placeholder="Especialidad"
          value={form.especialidad}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        />

        {/* 🔥 INSTITUCIÓN */}
        <input
          name="institucion"
          placeholder="Institución"
          value={form.institucion}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        />

        {/* 🔥 BOTÓN */}
        <button
          disabled={loading}
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            p-2
            rounded
            font-bold
            transition
            disabled:opacity-50
          "
        >

          {loading
            ? "Guardando..."
            : "Guardar"}

        </button>
      </form>
    </main>
  );
}
import Link from 'next/link';

export const metadata = { title: 'Términos de Uso — Favorcitos' };

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <Link href="/" className="text-sm font-medium" style={{ color: '#F97316' }}>
          ← Volver al inicio
        </Link>
      </div>

      <h1 className="mb-2 text-4xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#1A1A2E' }}>
        Términos de Uso
      </h1>
      <p className="mb-10 text-sm" style={{ color: '#9CA3AF' }}>
        Última actualización: abril 2026
      </p>

      <div className="space-y-8 text-base leading-relaxed" style={{ color: '#374151' }}>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar la plataforma Favorcitos, ya sea como cliente o como tasker, aceptas de forma expresa los presentes Términos de Uso. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestra plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>2. Naturaleza de la plataforma</h2>
          <p>
            Favorcitos es una plataforma digital de intermediación que conecta a personas que necesitan servicios (clientes) con personas dispuestas a prestarlos (taskers). Favorcitos <strong>no es empleador</strong> de ningún tasker, ni presta directamente los servicios ofertados en la plataforma. Cada tasker actúa de manera independiente y bajo su propia responsabilidad.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>3. Limitación de responsabilidad</h2>
          <p className="mb-3">
            <strong>Favorcitos no asume responsabilidad alguna</strong> por daños, lesiones, accidentes, pérdidas materiales o cualquier otro perjuicio que pudiera ocurrir durante, antes o después de la prestación de un servicio coordinado a través de la plataforma. Esto incluye, de manera enunciativa más no limitativa:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Accidentes laborales o personales sufridos por el tasker durante la realización del trabajo.</li>
            <li>Daños a la propiedad del cliente o de terceros causados por el tasker.</li>
            <li>Daños a la propiedad del tasker ocurridos en el domicilio del cliente.</li>
            <li>Lesiones físicas a cualquiera de las partes involucradas.</li>
            <li>Pérdidas económicas derivadas de un servicio mal ejecutado o incompleto.</li>
            <li>Disputas entre cliente y tasker relacionadas con la calidad, el precio o los términos del servicio.</li>
          </ul>
          <p className="mt-3">
            La relación contractual por la prestación del servicio se establece exclusivamente entre el cliente y el tasker. Favorcitos actúa únicamente como facilitador de dicho encuentro.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>4. Responsabilidad del tasker</h2>
          <p>
            Cada tasker es responsable de contar con las habilidades, herramientas, permisos y seguros necesarios para realizar los servicios que ofrece. Favorcitos no verifica, garantiza ni certifica las competencias técnicas de los taskers, salvo en los casos en que se indique expresamente el sello de "Verificado" en el perfil, el cual únicamente acredita una revisión básica de identidad.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>5. Responsabilidad del cliente</h2>
          <p>
            El cliente es responsable de proporcionar un entorno seguro para la realización del servicio y de comunicar cualquier condición especial o riesgo potencial antes del inicio del trabajo. Asimismo, el cliente debe verificar la identidad del tasker antes de permitirle el acceso a su domicilio o propiedad.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>6. Resolución de disputas</h2>
          <p>
            En caso de conflicto entre cliente y tasker, Favorcitos podrá actuar como mediador de buena fe, sin que ello implique obligación legal alguna de resolución. Cualquier disputa que no pueda resolverse de manera amistosa deberá atenderse conforme a la legislación aplicable en México.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>7. Modificaciones</h2>
          <p>
            Favorcitos se reserva el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización correspondiente. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold" style={{ color: '#1A1A2E' }}>8. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos Términos de Uso, puedes escribirnos a{' '}
            <a href="mailto:legal@favorcitos.mx" style={{ color: '#F97316' }}>legal@favorcitos.mx</a>.
          </p>
        </section>

      </div>

      <div
        className="mt-12 rounded-2xl p-6 text-center"
        style={{ backgroundColor: '#FFF7ED', border: '1px solid rgba(249,115,22,0.15)' }}
      >
        <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
          ¿Listo para comenzar?
        </p>
        <Link
          href="/auth"
          className="mt-3 inline-block rounded-xl px-6 py-2.5 text-sm font-bold text-white"
          style={{ backgroundColor: '#F97316' }}
        >
          Crear cuenta gratis
        </Link>
      </div>
    </div>
  );
}

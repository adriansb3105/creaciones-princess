const agendas = [
]

for (let i = 0; i < 36; i++) {
    agendas.push(
    {
        name: 'Agenda',
        img: 'agendas.jpg'
    }
    )
}

export default function Agendas(params) {
    return (
        <section>
            <h1 className="bg-[#ffe5ff] text-center text-5xl font-bold text-gray-400">Agendas</h1>
            
            <div className='bg-[#ffe5ff] py-5 px-10 sm:py-5 sm:px-16 columns-4 gap-3 mx-auto space-y-3'>
            {
                agendas.map((agenda) => {
                return (
                    <div key={agenda.name} className={`bg-gray-200 break-inside-avoid`}>
                        <img src={`/img/${agenda.img}`} alt={agenda.name} />
                    </div>
                )})
            }
            </div>
        </section>
    )
}
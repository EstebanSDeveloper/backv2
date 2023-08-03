class UserManagerMongo{
    constructor(model){
        this.model=model;
    };

    async getUsers(){
        try {
            const users = await this.model.find({}, { first_name: 1, last_name: 1, email: 1, role: 1, _id: 0 })
            const response = JSON.parse(JSON.stringify(users))
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUsersAdmin(){
        try {
            const users = await this.model.find({})
            const response = JSON.parse(JSON.stringify(users))
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addUser(user){
        try {
            const data = await this.model.create(user);
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`Error al guardar: ${error.message}`);
        }
    };

    async getUserByEmail(email){
        try {
            const data = await this.model.findOne({email:email});
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    };

    async deleteNotConnected(){
        try {
            // Obtener la fecha actual menos 30 días
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Buscar los usuarios que llevan más de 30 días sin conexión
            const usersToDelete = await this.model.find({ last_connection: { $lt: thirtyDaysAgo } });

            // Almacenar los nombres de los usuarios eliminados
            const deletedUserNames = usersToDelete.map((user) => ({
                first_name: user.first_name,
                last_name: user.last_name,
            }));

            // Eliminar los usuarios encontrados de la base de datos
            for (const user of usersToDelete) {
                await this.model.deleteOne({ _id: user._id });
            }

            // Retornar la cantidad de usuarios eliminados
            return [usersToDelete.length, deletedUserNames];

        } catch (error) {
            throw new Error(`Error al eliminar usuarios no conectados: ${error.message}`);
        }
    }

    async deleteUser(id){
        try {
            const user = await this.model.findByIdAndDelete(id);
            return user
        } catch (error) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`);
        }
    } 
}

export {UserManagerMongo};
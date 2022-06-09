const tabla = 'friends';

class FriendsDAO {

    async getFriendsRequest(id) {  
        const results = await global.connection.promise().query(`SELECT DISTINCT(users.id), users.name, users.last_name, users.image, users.email FROM users INNER JOIN friends ON users.id = friends.user_id WHERE friends.status = 0 AND friends.user_id_friend = ? ORDER BY users.id`, [id]);
        if (results[0].length === 0) {
            return { error: "No tienes ninguna Friend Request." };
        } else {
            return results[0];
        }
    }

    async getFriends(id) {  
        const results = await global.connection.promise().query(`SELECT users.id, users.name, users.last_name, users.image, users.email FROM users INNER JOIN friends ON users.id = friends.user_id WHERE friends.status = 1 AND friends.user_id_friend = ? ORDER BY users.id`, [id]);
        if (results[0].length === 0) {
            return { error: "No tienes amigos." };
        } else {
            return results[0];
        }
    }

    async postFriends(owner_id, friend_id) {  
        try {
            const results = await global.connection.promise().query(`INSERT INTO friends (user_id, user_id_friend, status) VALUES (${owner_id}, ${friend_id}, 0)`);
            return results[0];
        } catch (error) {
            return { error: "Missing parameter." };
        }
    }

    async putFriends(owner_id, friend_id) {  
        try {
            const results = await global.connection.promise().query(`UPDATE friends SET status = 1 WHERE user_id = ${friend_id} AND user_id_friend = ${owner_id}`);
            return results[0];
        } catch (error){
            return { error: "Missing parameter." };
        }
    }

    async deleteFriends(owner_id, friend_id) {  
        try {
            const results = await global.connection.promise().query(`DELETE FROM friends WHERE user_id = ${owner_id} AND user_id_friend = ${friend_id}`);
            return results[0];
        } catch (error){
            return { error: "Missing parameter." };
        }
    }
}

module.exports = FriendsDAO
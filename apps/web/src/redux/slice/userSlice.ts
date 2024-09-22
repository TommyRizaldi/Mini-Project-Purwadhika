import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserState } from '@/type/user'; // Adjust the import as necessary

const initialState: IUserState = {
    UserId: "",
    Username: "",
    Name: "",
    Email: "",
    Type: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginAction: (state, action: PayloadAction<IUserState>) => {
            const { UserId, Username, Name, Email, Type } = action.payload;
            state.UserId = UserId;
            state.Username = Username;
            state.Name = Name;
            state.Email = Email;
            state.Type = Type;
        },
        logoutAction: (state) => {
            state.UserId = "";
            state.Username = "";
            state.Name = "";
            state.Email = "";
            state.Type = "";
        }
    }
});

// Export actions and reducer
export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;

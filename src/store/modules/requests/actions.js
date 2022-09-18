export default {
  async contactCoach(context, payload) {
    const newRequest = {
      userEmail: payload.email,
      message: payload.message,
    };

    const response = await fetch(
      `https://vue-coach-finder-app-87299-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
      {
        method: "POST",
        body: JSON.stringify(newRequest),
      }
    );
    if (!response.ok) {
      // error/
      const error = new Error(response.message || "Failed to send request.");
      throw error;
    }
    const responseData = response.json();

    newRequest.id = responseData.name; // Assigning automatically generated ID from Firebase to our newRequest.

    newRequest.coachId = payload.coachId;

    context.commit("addRequest", newRequest);
  },
  async fetchRequests(context) {
    console.log("Context: ", context);
    const coachId = context.rootGetters.userId;
    console.log(coachId);
    const token = context.rootGetters.token;
    console.log("HERE");
    console.log(token);
    const response = await fetch(
      `https://vue-coach-finder-app-87299-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=` +
        token
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to fetch requests."
      );
      throw error;
    }

    const requests = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };
      requests.push(request);
    }
    context.commit("setRequests", requests);
  },
};

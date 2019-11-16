db.collection('users').get().then((users) => { // eslint-disable-line no-undef
  users.docs.forEach((user) => {
    const { words } = user.data();
    words.forEach((word) => {
      const wordData = { ...word };
      delete wordData.id;
      db // eslint-disable-line no-undef
        .collection('users')
        .doc(user.id)
        .collection('words')
        .doc(word.id)
        .set(wordData);
    });
  });
});

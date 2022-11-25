var currentUser;
var idCounter = 0;

function getListItem(item) {
	return `
		<li class="comments-list__item" id="comment-${item.id}">
	        <div class="comment__item" id="comment-item-${item.id}">
	          <ul class="acknowledgements">
	            <button class="icon icon-plus" onclick="incrementScore(${item.id})">
	              <img src="./images/icon-plus.svg" alt="icon-plus">
	            </button>
	            <li class="acknowledgements__count" id="acknowledgementsCount-${item.id}">${item.score}</li>
	            <button class="icon icon-minus" onclick="decrementScore(${item.id})">
	              <img src="./images/icon-minus.svg" alt="icon-minus">
	            </button>
	          </ul>
	          <div class="comment">
	            <div class="comment__header">
	              <div class="user-details">
	                <img src="${item.user.image.png}" class="profile-picture">
	                <span class="profile-name">${item.user.username}</span>
	                <span class="user-tag ${item.user.username != currentUser.username ? 'd-none' : ''}">you</span>
	                <span class="comment__time">${item.createdAt}</span>
	              </div>
	              <div class="comment-actions">
	                <button class="action-btn action-btn__reply ${item.user.username == currentUser.username ? 'd-none' : ''}" onclick="addReplyBox(${item.id})">
	                  <img src="./images/icon-reply.svg" alt="icon-reply" class="icon-reply">
	                  Reply
	                </button>
	                <button class="action-btn action-btn__delete ${item.user.username != currentUser.username ? 'd-none' : ''}" onclick="openDeleteModal(${item.id})">
	                  <img src="./images/icon-delete.svg" alt="icon-reply" class="icon-delete">
	                  Delete
	                </button>
	                <button class="action-btn action-btn__edit ${item.user.username != currentUser.username ? 'd-none' : ''}" onclick="openEditBox(${item.id})">
	                  <img src="./images/icon-edit.svg" alt="icon-reply" class="icon-edit">
	                  Edit
	                </button>
	              </div>
	            </div>
	            <p class="comment__message" id="comment-${item.id}-content">
	              ${item.content}
	            </p>    
	          </div>
	        </div>
	        ${(item.replies && item.replies.length) > 0 ? createRepliesList(item.id, item.replies) : ''}
	    </li>`
}

function createRepliesList(commentId, replies) {
	let list = `<ul class="comments-list--inner" id="replies-${commentId}">`;
	replies.forEach(reply => {
		list += getListItem(reply);
		idCounter = Math.max(idCounter, reply.id);
	});
	list += '</ul>'

	return list;
}

function loadData(data) {
	currentUser = data.currentUser;

	const commentList = document.getElementById('commentList');

	data.comments.forEach(item => {
		var comment = getListItem(item);
		idCounter = Math.max(idCounter, item.id);
		commentList.insertAdjacentHTML('beforeend', getListItem(item));
	});

	console.log(idCounter)
}

(loadData());

function getReplyBox(commentId, content = '') {
	const replyBox = 
	`<div class="add-comment" id="replyBox-${commentId}">
      <img src="${currentUser.image.png}" class="profile-picture">
      <textarea class="add-comment__box" placeholder="Add a comment..." id="reply-content-${commentId}" >${content}</textarea>
      <button class="send__btn" onclick="${content == '' ? `addReply(${commentId})` : `editReply(${commentId})`}">Send</button>
    </div>`
    return replyBox;
}

function getDeleteModal(commentId) {
	let deleteModal = 
	`<div class="dark-bg" id="delete-comment-${commentId}-modal">
    	<div class="delete-modal">
      		<h1>Delete comment</h1>
      		<p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.
      		</p>
      		<div class="actions">
        		<button class="cancel-btn" onclick="closeDeleteModal(${commentId})">No, cancel</button>
        		<button class="delete-btn" onclick="deleteComment(${commentId})">Yes, Delete</button>
      		</div>
    	</div>
  	</div>`;
  return deleteModal;
}

function openDeleteModal(commentId) {
	const main = document.getElementById('main');
	main.insertAdjacentHTML('afterend', getDeleteModal(commentId));
}

function closeDeleteModal(commentId) {
	document.getElementById(`delete-comment-${commentId}-modal`)?.remove();
}

function incrementScore(commentId) {
	const acknowledgementsCount = document.getElementById(`acknowledgementsCount-${commentId}`);
	acknowledgementsCount.innerHTML = Number(acknowledgementsCount.innerHTML) + 1;
}

function decrementScore(commentId) {
	const acknowledgementsCount = document.getElementById(`acknowledgementsCount-${commentId}`);
	acknowledgementsCount.innerHTML = Number(acknowledgementsCount.innerHTML) - 1;
}

function deleteComment(commentId) {
	document.getElementById(`comment-${commentId}`)?.remove();
	closeDeleteModal(commentId);
}

function addReplyBox(commentId, content = '') {
	if(document.getElementById(`reply-content-${commentId}`)) return;
	const commentItem = document.getElementById(`comment-${commentId}`);
	commentItem.insertAdjacentHTML('afterend', getReplyBox(commentId, content));
}

function addReply(replyTo) {
	const content = document.getElementById(`reply-content-${replyTo}`).value;
	if (content == '' || content == null) return;
	const reply = {
	    "id": ++idCounter,
	    "content": content,
	    "createdAt": "1 month ago",
	    "score": 0,
	    "user": currentUser
	}
	const replyList = document.getElementById(`replies-${replyTo}`);
	if (replyList) {
		replyList.insertAdjacentHTML('beforeend', getListItem(reply));
	}
	else {
		const commentItem = document.getElementById(`comment-item-${replyTo}`);
		commentItem.insertAdjacentHTML('afterend', createRepliesList(replyTo, [reply]));
	}
	document.getElementById(`replyBox-${replyTo}`)?.remove();
}

function openEditBox(commentId) {
	const replyItem = document.getElementById(`comment-${commentId}`);
	replyItem.classList.add('d-none');
	const commentContent = document.getElementById(`comment-${commentId}-content`);
	addReplyBox(commentId, commentContent.innerHTML);
}

function editReply(commentId) {
	const replyItem = document.getElementById(`comment-${commentId}`);
	replyItem.classList.remove('d-none');
	document.getElementById(`comment-${commentId}-content`).innerHTML = document.getElementById(`reply-content-${commentId}`).value;
	document.getElementById(`replyBox-${commentId}`)?.remove();
}
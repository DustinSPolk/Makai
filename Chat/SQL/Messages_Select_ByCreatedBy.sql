USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByCreatedBy]    Script Date: 5/10/2023 11:57:19 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-14-2023
-- Description: Select Messages Sent by UserId
-- Code Reviewer:

-- MODIFIED BY: Dustin Polk
-- MODIFIED DATE: 03-28-2023
-- Code Reviewer: Osein Solkin
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Select_ByCreatedBy]
	      @SenderId int
	      ,@PageIndex int
	      ,@PageSize int

as

/* --- TEST ---

	DECLARE @SenderId int = 576
			    ,@PageIndex int = 0
			    ,@PageSize int = 20

	EXECUTE [dbo].[Messages_Select_ByCreatedBy]
		      @SenderId
		      ,@PageIndex
		      ,@PageSize


*/

BEGIN
	
	DECLARE @Offset int = @PageIndex * @PageSize

	SELECT m.Id
		  ,m.Message
		  ,m.Subject
		  ,m.RecipientId
			,ur.FirstName
			,ur.LastName
			,ur.Mi
			,ur.AvatarUrl
		  ,m.SenderId
			,us.FirstName
			,us.LastName
			,us.Mi
			,us.AvatarUrl
		  ,m.DateSent
		  ,m.DateRead
		  ,m.DateModified
		  ,m.DateCreated
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Messages] AS m
	INNER JOIN [dbo].[Users] as ur
	  ON m.RecipientId = ur.Id
	INNER JOIN [dbo].[Users] as us
	  ON m.SenderId = us.Id  

	WHERE  m.SenderId = @SenderId

	ORDER BY DateCreated

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
